import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

type MarkdownNode = {
  type: string
  value?: string
  name?: string
  attributes?: Array<{
    type: 'mdxJsxAttribute'
    name: string
    value: string
  }>
  children?: MarkdownNode[]
}

const CALLOUT_ALIASES: Record<string, string> = {
  caution: 'caution',
  danger: 'danger',
  error: 'danger',
  important: 'important',
  info: 'info',
  note: 'note',
  success: 'success',
  tip: 'tip',
  warning: 'warning',
}

const prettyCodeOptions = {
  theme: {
    dark: 'github-dark-dimmed',
    light: 'github-light',
  },
  keepBackground: false,
  bypassInlineCode: true,
  defaultLang: 'plaintext',
}

function getTextContent(node: MarkdownNode): string {
  if (typeof node.value === 'string') {
    return node.value
  }

  return node.children?.map(getTextContent).join('') ?? ''
}

function normalizeCalloutType(rawType: string): string | null {
  return CALLOUT_ALIASES[rawType.trim().toLowerCase()] ?? null
}

function isParagraph(node: MarkdownNode): boolean {
  return node.type === 'paragraph'
}

function isContainerEnd(node: MarkdownNode): boolean {
  return isParagraph(node) && getTextContent(node).trim() === ':::'
}

function parseContainerStart(node: MarkdownNode): string | null {
  if (!isParagraph(node)) {
    return null
  }

  const match = getTextContent(node).trim().match(/^:::\s*([a-z-]+)\s*$/i)
  if (!match) {
    return null
  }

  return normalizeCalloutType(match[1])
}

function parseDirectiveCallout(node: MarkdownNode): MarkdownNode | null {
  if (node.type !== 'containerDirective' || !node.name) {
    return null
  }

  const type = normalizeCalloutType(node.name)
  if (!type) {
    return null
  }

  const contentChildren = node.children ?? []
  transformCallouts({ type: 'root', children: contentChildren })

  return createCalloutNode(type, contentChildren)
}

function createCalloutNode(type: string, children: MarkdownNode[]): MarkdownNode {
  return {
    type: 'mdxJsxFlowElement',
    name: 'Callout',
    attributes: [
      {
        type: 'mdxJsxAttribute',
        name: 'type',
        value: type,
      },
    ],
    children,
  }
}

function parseAlertBlockquote(node: MarkdownNode): MarkdownNode | null {
  if (node.type !== 'blockquote' || !node.children?.length) {
    return null
  }

  const [firstChild, ...restChildren] = node.children
  if (!isParagraph(firstChild) || !firstChild.children?.length) {
    return null
  }

  const firstInlineChild = firstChild.children[0]
  if (firstInlineChild?.type !== 'text' || typeof firstInlineChild.value !== 'string') {
    return null
  }

  const match = firstInlineChild.value.match(/^\[!([a-z-]+)\]\s*/i)
  if (!match) {
    return null
  }

  const type = normalizeCalloutType(match[1])
  if (!type) {
    return null
  }

  const normalizedFirstChild = structuredClone(firstChild)
  const normalizedFirstInlineChild = normalizedFirstChild.children?.[0]
  if (normalizedFirstInlineChild?.type === 'text' && typeof normalizedFirstInlineChild.value === 'string') {
    normalizedFirstInlineChild.value = normalizedFirstInlineChild.value.replace(/^\[!([a-z-]+)\]\s*/i, '')
  }

  const contentChildren =
    getTextContent(normalizedFirstChild).trim().length > 0
      ? [normalizedFirstChild, ...restChildren]
      : restChildren

  return createCalloutNode(type, contentChildren)
}

function transformCalloutChildren(children: MarkdownNode[]): MarkdownNode[] {
  const transformedChildren: MarkdownNode[] = []

  for (let index = 0; index < children.length; index += 1) {
    const node = children[index]
    const directiveCallout = parseDirectiveCallout(node)

    if (directiveCallout) {
      transformedChildren.push(directiveCallout)
      continue
    }

    const containerType = parseContainerStart(node)

    if (containerType) {
      const containerChildren: MarkdownNode[] = []
      let cursor = index + 1

      while (cursor < children.length && !isContainerEnd(children[cursor])) {
        containerChildren.push(children[cursor])
        cursor += 1
      }

      if (cursor < children.length && isContainerEnd(children[cursor])) {
        transformCallouts({ type: 'root', children: containerChildren })
        transformedChildren.push(createCalloutNode(containerType, containerChildren))
        index = cursor
        continue
      }
    }

    const blockquoteCallout = parseAlertBlockquote(node)
    if (blockquoteCallout) {
      transformCallouts(blockquoteCallout)
      transformedChildren.push(blockquoteCallout)
      continue
    }

    transformCallouts(node)
    transformedChildren.push(node)
  }

  return transformedChildren
}

function transformCallouts(node: MarkdownNode) {
  if (!node.children?.length) {
    return
  }

  node.children = transformCalloutChildren(node.children)
}

function remarkHackmdCallouts() {
  return (tree: MarkdownNode) => {
    transformCallouts(tree)
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/ethan-web/',
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkDirective,
          remarkHackmdCallouts,
        ],
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
      }),
    },
    react({ include: /\.(js|jsx|ts|tsx)$/ }),
  ],
})
