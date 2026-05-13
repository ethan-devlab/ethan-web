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
  data?: Record<string, unknown>
  children?: MarkdownNode[]
}

type ParsedCalloutStart = {
  type: string
  title?: string
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

function normalizeCalloutTitle(rawTitle: string): string {
  return rawTitle.replace(/(?:<br\s*\/?>\s*)+$/gi, '').trim()
}

function isParagraph(node: MarkdownNode): boolean {
  return node.type === 'paragraph'
}

function isContainerEnd(node: MarkdownNode): boolean {
  return isParagraph(node) && getTextContent(node).trim() === ':::'
}

function parseContainerStart(node: MarkdownNode): ParsedCalloutStart | null {
  if (!isParagraph(node)) {
    return null
  }

  const match = getTextContent(node).trim().match(/^:::\s*([a-z-]+)(?:[ \t]+(.*))?$/i)
  if (!match) {
    return null
  }

  const type = normalizeCalloutType(match[1])
  if (!type) {
    return null
  }

  return {
    type,
    title: match[2] === undefined ? undefined : normalizeCalloutTitle(match[2]),
  }
}

function parseDirectiveCallout(node: MarkdownNode): MarkdownNode | null {
  if (node.type !== 'containerDirective' || !node.name) {
    return null
  }

  const type = normalizeCalloutType(node.name)
  if (!type) {
    return null
  }

  const { contentChildren, title } = extractDirectiveLabelTitle(node.children ?? [])
  transformCallouts({ type: 'root', children: contentChildren })

  return createCalloutNode(type, contentChildren, title)
}

function createCalloutNode(type: string, children: MarkdownNode[], title?: string): MarkdownNode {
  const attributes: NonNullable<MarkdownNode['attributes']> = [
    {
      type: 'mdxJsxAttribute',
      name: 'type',
      value: type,
    },
  ]

  if (title !== undefined) {
    attributes.push({
      type: 'mdxJsxAttribute',
      name: 'title',
      value: title,
    })
  }

  return {
    type: 'mdxJsxFlowElement',
    name: 'Callout',
    attributes,
    children,
  }
}

function isDirectiveLabel(node: MarkdownNode): boolean {
  return node.data?.directiveLabel === true
}

function extractDirectiveLabelTitle(children: MarkdownNode[]): {
  contentChildren: MarkdownNode[]
  title?: string
} {
  const [firstChild, ...restChildren] = children

  if (!firstChild || !isDirectiveLabel(firstChild)) {
    return { contentChildren: children }
  }

  return {
    contentChildren: restChildren,
    title: normalizeCalloutTitle(getTextContent(firstChild)),
  }
}

function splitParagraphAfterAlertMarker(paragraph: MarkdownNode): {
  bodyParagraph: MarkdownNode
  title: string
} {
  const bodyParagraph = structuredClone(paragraph)
  const children = bodyParagraph.children ?? []
  const firstInlineChild = children[0]

  if (firstInlineChild?.type === 'text' && typeof firstInlineChild.value === 'string') {
    firstInlineChild.value = firstInlineChild.value.replace(/^\[!([a-z-]+)\][^\S\r\n]*/i, '')
  }

  const titleChildren: MarkdownNode[] = []
  const bodyChildren: MarkdownNode[] = []
  let hasLineBreak = false

  for (const child of children) {
    if (hasLineBreak) {
      bodyChildren.push(child)
      continue
    }

    if (child.type !== 'text' || typeof child.value !== 'string') {
      titleChildren.push(child)
      continue
    }

    const lineBreakIndex = child.value.search(/\r?\n/)

    if (lineBreakIndex === -1) {
      titleChildren.push(child)
      continue
    }

    const titleValue = child.value.slice(0, lineBreakIndex)
    const bodyValue = child.value.slice(lineBreakIndex).replace(/^\r?\n/, '')

    if (titleValue) {
      titleChildren.push({ ...child, value: titleValue })
    }

    if (bodyValue) {
      bodyChildren.push({ ...child, value: bodyValue })
    }

    hasLineBreak = true
  }

  bodyParagraph.children = bodyChildren

  return {
    bodyParagraph,
    title: normalizeCalloutTitle(getTextContent({ type: 'root', children: titleChildren })),
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

  const match = firstInlineChild.value.match(/^\[!([a-z-]+)\][^\S\r\n]*/i)
  if (!match) {
    return null
  }

  const type = normalizeCalloutType(match[1])
  if (!type) {
    return null
  }

  const { bodyParagraph, title } = splitParagraphAfterAlertMarker(firstChild)

  const contentChildren =
    getTextContent(bodyParagraph).trim().length > 0
      ? [bodyParagraph, ...restChildren]
      : restChildren

  return createCalloutNode(type, contentChildren, title)
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

    const containerStart = parseContainerStart(node)

    if (containerStart) {
      const containerChildren: MarkdownNode[] = []
      let cursor = index + 1

      while (cursor < children.length && !isContainerEnd(children[cursor])) {
        containerChildren.push(children[cursor])
        cursor += 1
      }

      if (cursor < children.length && isContainerEnd(children[cursor])) {
        transformCallouts({ type: 'root', children: containerChildren })
        transformedChildren.push(createCalloutNode(containerStart.type, containerChildren, containerStart.title))
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
  base: '/',
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
