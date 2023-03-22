import { Panel } from '@magickml/client-core'
import css from '../screens/HomeScreen/homeScreen.module.css'

const TemplatePanel = ({ template, setSelectedTemplate, selectedTemplate }) => {
  const isSelected =
    selectedTemplate?.name && selectedTemplate.name === template.name
  return (
    <div
      className={`${css['template-container']} ${
        css[isSelected && 'selected']
      }`}
      onClick={() => {
        setSelectedTemplate(template)
      }}
    >
      <Panel
        shadow
        style={{
          width: 'var(--c20)',
          height: 'var(--c12)',
          backgroundColor: 'var(--dark-3)',
          backgroundImage: `url(${template.bg})`,
        }}
        className={css['template-panel']}
      ></Panel>
      <p>{template.name}</p>
    </div>
  )
}

export default TemplatePanel
