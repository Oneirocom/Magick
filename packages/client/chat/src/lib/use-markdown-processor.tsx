import { Root } from 'hast'
import mermaid from 'mermaid'
import Link from 'next/link'
import {
  Children,
  Fragment,
  createElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react'
import flattenChildren from 'react-keyed-flatten-children'
import rehypeHighlight from 'rehype-highlight'
import rehypeReact from 'rehype-react'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { Plugin, unified } from 'unified'
import { visit } from 'unist-util-visit'
import { HtmlGenerator, parse } from 'latex.js'
import { useTheme } from 'next-themes'
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/20/solid'

// Mixing arbitrary Markdown + Capsize leads to lots of challenges
// with paragraphs and list items. This replaces paragraphs inside
// list items into divs to avoid nesting Capsize.
const rehypeListItemParagraphToDiv: Plugin<[], Root> = () => {
  return tree => {
    visit(tree, 'element', element => {
      if (element.tagName === 'li') {
        element.children = element.children.map(child => {
          if (child.type === 'element' && child.tagName === 'p') {
            child.tagName = 'div'
          }
          return child
        })
      }
    })
    return tree
  }
}

export const useMarkdownProcessor = (content: string) => {
  const theme = useTheme().theme
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
    })
  }, [theme])

  // useEffect(() => {
  //   if (theme === 'dark') {
  //     require('highlight.js/styles/github-dark.css')
  //   } else {
  //     require('highlight.js/styles/github.css')
  //   }
  // }, [theme])

  return useMemo(() => {
    return unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeHighlight, { ignoreMissing: true })
      .use(rehypeListItemParagraphToDiv)
      .use(rehypeReact, {
        createElement,
        Fragment,
        components: {
          a: ({ href, children }: JSX.IntrinsicElements['a']) => (
            <a href={href} target="_blank" rel="noreferrer" className="link">
              {children}
            </a>
          ),
          img: ({ src, alt }: JSX.IntrinsicElements['img']) => (
            <img src={src} alt={alt} className="" />
          ),
          h1: ({ children, id }: JSX.IntrinsicElements['h1']) => (
            <h1 className=" font-semibold text-3xl my-3" id={id}>
              {children}
            </h1>
          ),
          h2: ({ children, id }: JSX.IntrinsicElements['h2']) => (
            <h2 className=" font-medium text-3xl my-3" id={id}>
              {children}
            </h2>
          ),
          h3: ({ children, id }: JSX.IntrinsicElements['h3']) => (
            <h3 className=" font-semibold text-2xl my-3" id={id}>
              {children}
            </h3>
          ),
          h4: ({ children, id }: JSX.IntrinsicElements['h4']) => (
            <h4 className=" font-medium text-2xl my-2" id={id}>
              {children}
            </h4>
          ),
          h5: ({ children, id }: JSX.IntrinsicElements['h5']) => (
            <h5 className=" font-semibold text-xl ,y-2" id={id}>
              {children}
            </h5>
          ),
          h6: ({ children, id }: JSX.IntrinsicElements['h6']) => (
            <h6 className=" font-medium text-xl" id={id}>
              {children}
            </h6>
          ),
          p: (props: JSX.IntrinsicElements['p']) => {
            return (
              <p className=" text-sm md:text-base lg:text-lg ">
                {props.children}
              </p>
            )
          },
          strong: ({ children }: JSX.IntrinsicElements['strong']) => (
            <strong className=" font-semibold">{children}</strong>
          ),
          em: ({ children }: JSX.IntrinsicElements['em']) => (
            <em>{children}</em>
          ),
          code: CodeBlock,
          pre: ({ children }: JSX.IntrinsicElements['pre']) => {
            return (
              <div className="relative mb-6">
                <pre className="whitespace-pre-wrap p-4 rounded-lg rounded-tl-none rounded-br-none bg-[#f0f5f6] dark:bg-[#262b2e] [&>code.hljs]:p-0 [&>code.hljs]:bg-transparent font-code text-sm md:text-base lg:text-lg overflow-x-auto flex items-start">
                  {children}
                </pre>
              </div>
            )
          },
          ul: ({ children }: JSX.IntrinsicElements['ul']) => (
            <ul className="flex flex-col gap-3 pl-3 [&_ol]:my-3 [&_ul]:my-3">
              {Children.map(
                flattenChildren(children).filter(isValidElement),
                (child, index) => (
                  <li key={index} className="flex gap-2 items-start">
                    <div className="w-1 h-1 rounded-full bg-current block shrink-0 mt-1" />
                    {child}
                  </li>
                )
              )}
            </ul>
          ),
          ol: ({ children }: JSX.IntrinsicElements['ol']) => (
            <ol className="flex flex-col gap-3 pl-3 [&_ol]:my-3 [&_ul]:my-3">
              {Children.map(
                flattenChildren(children).filter(isValidElement),
                (child, index) => (
                  <li key={index} className="flex gap-2 items-start">
                    <div
                      className=" text-sm md:text-base lg:text-lg font-semibold shrink-0 min-w-[1.4ch]"
                      aria-hidden
                    >
                      {index + 1}.
                    </div>
                    {child}
                  </li>
                )
              )}
            </ol>
          ),
          li: ({ children }: JSX.IntrinsicElements['li']) => (
            <div className=" text-sm md:text-base lg:text-lg">{children}</div>
          ),
          table: ({ children }: JSX.IntrinsicElements['table']) => (
            <div className="overflow-x-auto ">
              <table className="table-auto border-2 border-black dark:border-white">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }: JSX.IntrinsicElements['thead']) => (
            <thead className="bg-[#f0f5f6] dark:bg-[#262b2e]">{children}</thead>
          ),
          th: ({ children }: JSX.IntrinsicElements['th']) => (
            <th className="border-2 border-black dark:border-white p-2  text-sm md:text-base lg:text-lg font-semibold ">
              {children}
            </th>
          ),
          td: ({ children }: JSX.IntrinsicElements['td']) => (
            <td className="border-2 border-black dark:border-white p-2  text-sm md:text-base lg:text-lg ">
              {children}
            </td>
          ),
          blockquote: ({ children }: JSX.IntrinsicElements['blockquote']) => (
            <blockquote className="border-l-4 border-black dark:border-white pl-2  italic">
              {children}
            </blockquote>
          ),
        },
      })
      .processSync(content).result
  }, [content])
}

const CodeBlock = ({ children, className }: JSX.IntrinsicElements['code']) => {
  const [copied, setCopied] = useState(false)
  // const [showMermaidPreview, setShowMermaidPreview] = useState(false)
  // const [showLatexPreview, setShowLatexPreview] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (copied) {
      const interval = setTimeout(() => setCopied(false), 1000)
      return () => clearTimeout(interval)
    }
  }, [copied])

  // Highlight.js adds a `className` so this is a hack to detect if the code block
  // is a language block wrapped in a `pre` tag.
  if (className) {
    const isMermaid = className.includes('language-mermaid')
    const isLatex = className.includes('language-latex')

    return (
      <div className="flex flex-col">
        <code className="" ref={ref}>
          {children}
        </code>
        <button
          type="button"
          className="rounded-md p-1 color-transition absolute top-2 right-2"
          aria-label="copy code to clipboard"
          title="Copy code to clipboard"
          onClick={() => {
            if (ref.current) {
              navigator.clipboard.writeText(ref.current.innerText ?? '')
              setCopied(true)
            }
          }}
        >
          {copied ? (
            <ClipboardDocumentCheckIcon className="w-4 h-4" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4" />
          )}
        </button>
        <div className="flex flex-col gap-1 flex-grow-0 flex-shrink-0">
          {isMermaid ? <Mermaid content={children?.toString() ?? ''} /> : null}
          {isLatex ? <Latex content={children?.toString() ?? ''} /> : null}
        </div>
      </div>
    )
  }

  return (
    <code className="inline-block font-code bg-[#f0f5f6] dark:bg-[#262b2e]  p-0.5 -my-0.5 rounded">
      {children}
    </code>
  )
}

const Latex = ({ content }: { content: string }) => {
  const [diagram, setDiagram] = useState<string | boolean>(true)

  useEffect(() => {
    try {
      const generator = new HtmlGenerator({ hyphenate: false })
      const fragment = parse(content, { generator: generator }).domFragment()
      setDiagram(fragment.firstElementChild.outerHTML)
    } catch (error) {
      console.error(error)
      setDiagram(false)
    }
  }, [content])

  if (diagram === true) {
    return (
      <div className="flex gap-2 items-center">
        <span className="loading loading-spinner w-4 h-4 " />
        <p className=" text-sm md:text-base lg:text-lg text-slate-700">
          Rendering equation...
        </p>
      </div>
    )
  } else if (diagram === false) {
    return (
      <p className=" text-sm md:text-base lg:text-lg text-slate-700">
        Unable to render this equation.
      </p>
    )
  } else {
    return <div dangerouslySetInnerHTML={{ __html: diagram ?? '' }} />
  }
}

const Mermaid = ({ content }: { content: string }) => {
  const [diagram, setDiagram] = useState<string | boolean>(true)

  useEffect(() => {
    const render = async () => {
      // Generate a random ID for mermaid to use.
      const id = `mermaid-svg-${Math.round(Math.random() * 10000000)}`

      // Confirm the diagram is valid before rendering.
      if (await mermaid.parse(content, { suppressErrors: true })) {
        const { svg } = await mermaid.render(id, content)

        // Create a DOM parser to manipulate the SVG string
        const parser = new DOMParser()
        const doc = parser.parseFromString(svg, 'image/svg+xml')
        const svgElement = doc.querySelector('svg')

        // Update the height attribute
        if (svgElement) {
          svgElement.setAttribute('height', '100%')
          setDiagram(svgElement.outerHTML)
        } else {
          setDiagram(false)
        }
      } else {
        setDiagram(false)
      }
    }
    render()
  }, [content])

  if (diagram === true) {
    return (
      <div className="flex gap-2 items-center">
        <span className="loading-spinner" />
        <p className=" text-sm md:text-base lg:text-lg">Rendering diagram...</p>
      </div>
    )
  } else if (diagram === false) {
    return (
      <p className=" text-sm md:text-base lg:text-lg">
        Unable to render this diagram. Try copying it into the{' '}
        <Link href="https://mermaid.live/edit" target="_blank">
          Mermaid Live Editor
        </Link>
        .
      </p>
    )
  } else {
    return <div dangerouslySetInnerHTML={{ __html: diagram ?? '' }} />
  }
}

export const MARKDOWN_TEST_MESSAGE = `
# Heading level 1

This is the first paragraph.

This is the second paragraph.

This is the third paragraph.

## Heading level 2

This is an [anchor](https://github.com).

### Heading level 3

This is **bold** and _italics_.

#### Heading level 4

This is \`inline\` code.

This is a code block:

\`\`\`tsx
const Message = () => {
  return <div>hi</div>;
};
\`\`\`

##### Heading level 5

This is an unordered list:

- One
- Two
- Three, and **bold**

This is an ordered list:

1. One
1. Two
1. Three

This is a complex list:

1. **Bold**: One
    - One
    - Two
    - Three
  
2. **Bold**: Three
    - One
    - Two
    - Three
  
3. **Bold**: Four
    - One
    - Two
    - Three

###### Heading level 6

> This is a blockquote.

This is a table:

| Vegetable | Description |
|-----------|-------------|
| Carrot    | A crunchy, orange root vegetable that is rich in vitamins and minerals. It is commonly used in soups, salads, and as a snack. |
| Broccoli  | A green vegetable with tightly packed florets that is high in fiber, vitamins, and antioxidants. It can be steamed, boiled, stir-fried, or roasted. |
| Spinach   | A leafy green vegetable that is dense in nutrients like iron, calcium, and vitamins. It can be eaten raw in salads or cooked in various dishes. |
| Bell Pepper | A colorful, sweet vegetable available in different colors such as red, yellow, and green. It is often used in stir-fries, salads, or stuffed recipes. |
| Tomato    | A juicy fruit often used as a vegetable in culinary preparations. It comes in various shapes, sizes, and colors and is used in salads, sauces, and sandwiches. |
| Cucumber   | A cool and refreshing vegetable with a high water content. It is commonly used in salads, sandwiches, or as a crunchy snack. |
| Zucchini | A summer squash with a mild flavor and tender texture. It can be sautéed, grilled, roasted, or used in baking recipes. |
| Cauliflower | A versatile vegetable that can be roasted, steamed, mashed, or used to make gluten-free alternatives like cauliflower rice or pizza crust. |
| Green Beans | Long, slender pods that are low in calories and rich in vitamins. They can be steamed, stir-fried, or used in casseroles and salads. |
| Potato | A starchy vegetable available in various varieties. It can be boiled, baked, mashed, or used in soups, fries, and many other dishes. |

This is a mermaid diagram:

\`\`\`mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    commit
\`\`\`

\`\`\`latex
\\[F(x) = \\int_{a}^{b} f(x) \\, dx\\]
\`\`\`
`
