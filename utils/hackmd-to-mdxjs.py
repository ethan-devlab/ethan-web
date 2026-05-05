import re
import os

def convert_hackmd_to_mdxjs(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        input_str = f.read()
    # input_str = input_file
    # it either matches ![alt](url) or ![alt](url =widthxheight) or ![alt](url =widthx)
    pattern = re.compile(r'!\[([^\]]*)\]\(([^\s)]+)(?:\s*=\s*(\d+)?(?:x(\d+)?)?)?\)', re.IGNORECASE)

    def replace_image(match):
        alt = match.group(1)
        src = match.group(2)
        width = match.group(3)
        height = match.group(4)

        attrs = [f'src="{src}"', f'alt="{alt}"']
        if width:
            attrs.append(f'width="{width}"')
        if height:
            attrs.append(f'height="{height}"')

        return f'<img {" ".join(attrs)} />'

    output_str = re.sub(pattern, replace_image, input_str)
    # print(output_str)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(output_str)

test = """
## 編譯和安裝
到了這一步才是真正開始編譯和安裝
### 1. make
先以系統管理員權限打開 **CMD**，然後進入 **middle-build** 目錄，輸入 `mingw32-make -j 15`，15 表示將以 15 個執行緒來編譯，可依據CPU能力自行調整。
![image](https://hackmd.io/_uploads/r155MkPneg.png)

出現這個畫面代表編譯成功：
![image](https://hackmd.io/_uploads/B1wd2Jv2xl.png =600x)
"""

def markdown_link_open_in_new_tab(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        input_str = f.read()

    pattern = re.compile(r'\[([^\]]+)\]\((https?://[^\s)]+)\)', re.IGNORECASE)

    def add_target_blank(match):
        text = match.group(1)
        url = match.group(2)
        return f'<a href="{url}" target="_blank" rel="noopener noreferrer">{text}</a>'

    output_str = re.sub(pattern, add_target_blank, input_str)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(output_str)

if __name__ == "__main__":
    # filesdir = './hackmd/'
    filesdir = './src/content/blog/en/'
    # os.makedirs('./mdxjs/', exist_ok=True)
    for filename in os.listdir(filesdir):
        if filename.endswith('.mdx'):
            input_file = os.path.join(filesdir, filename)
            # output_file = os.path.join('./mdxjs/', filename.replace('.md', '.mdx'))
            output_file = input_file
            print(f'Processing {input_file}...')
            # convert_hackmd_to_mdxjs(input_file, output_file)
            markdown_link_open_in_new_tab(input_file, output_file)

    # result = convert_hackmd_to_mdxjs(test, './mdxjs/windows-vsc0ode-cpp-opencv.mdx')
    # print(result)



