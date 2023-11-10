// DOCUMENTED
// Import required components and hooks
import { Editor } from '../../../../contexts/EditorProvider'
import css from './editorwindow.module.css'

/**
 * EditorWindow functional component
 * @param {Object} props - Component properties
 * @param {Object} props.tab - Tab object
 * @returns {JSX.Element} EditorWindow component JSX
 */
const EditorWindow = ({ tab, spellId }) => {
  // Destructure required methods and properties from the useEditor hook
  // const { getNodes } = useEditor();

  // State management for deployOpen status
  // const [setDeployOpen] = useState(false);

  // Extract the nodeList and nodeMap using the provided methods
  // const nodeList = getNodes();
  // const nodeMap = getNodeMap();

  /**
   * handleNodeSelect function to create and add node in the editor
   * @async
   * @param {Object} e - Event object
   */
  // const handleNodeSelect = async e => {
  //   if (editor)
  //     editor.addNode(
  //       await createNode(nodeMap.get(e.value), {
  //         x: 0,
  //         y: 0,
  //       })
  //     );
  // };

  /**
   * getNodeOptions function to categorize node list into respective categories
   * @returns {Array} arr - Categorized node list
   */
  // const getNodeOptions = () => {
  //   const arr = [];

  //   /**
  //    * doesCategoryExist function
  //    * Checks if a category already exists in the array and returns its address,
  //    * otherwise returns false, and the nodeList map below creates a category.
  //    * @param {Array} arr - Array containing the categorized nodeList
  //    * @param {string} category - A string representing the category
  //    * @returns {(string|false)} - Address of the category in the array, or false if not found
  //    */
  //   const doesCategoryExist = (arr, category) => {
  //     let address = false;
  //     if (arr.length === 0) return false;

  //     arr.forEach((obj, index) => {
  //       if (obj.label === category) address = index;
  //     });
  //     return address;
  //   };

  //   // Categorize node list into respective categories
  //   if (nodeList)
  //     Object.keys(nodeList).map(item => {
  //       if (doesCategoryExist(arr, nodeList[item].category) !== false) {
  //         return arr[
  //           doesCategoryExist(arr, nodeList[item].category) as string
  //         ].options.push({
  //           label: nodeList[item].name,
  //           value: nodeList[item].name,
  //         });
  //       } else {
  //         return arr.push({
  //           label: nodeList[item].category,
  //           options: [
  //             { label: nodeList[item].name, value: nodeList[item].name },
  //           ],
  //         });
  //       }
  //     });
  //   return arr;
  // };

  /**
   * closeDeploy function to set deployOpen state to false
   */
  // const closeDeploy = () => {
  //   setDeployOpen(false);
  // };

  /**
   * EditorToolbar functional component
   * Renders the editor toolbar with buttons and select options
   * @returns {JSX.Element} EditorToolbar component JSX
   */
  // const EditorToolbar = () => {
  //   return (
  //     <React.Fragment>
  //       <Button style={{ opacity: 0 }}>Deploy...</Button>
  //       <Select
  //         searchable
  //         nested
  //         placeholder={'add node...'}
  //         onChange={async e => {
  //           await handleNodeSelect(e);
  //         }}
  //         options={getNodeOptions()}
  //         style={{ width: '50%' }}
  //         value={null}
  //         focusKey="cmd+p, ctl+p"
  //       />
  //       <Button
  //         onClick={() => {
  //           setDeployOpen(true);
  //         }}
  //       >
  //         Deploy
  //       </Button>
  //     </React.Fragment>
  //   );
  // };

  // Return EditorWindow component JSX
  return (
    <div className={css['editor-deployments-wrapper']}>
      <div className={css['editor-container']}>
        {/*
        <div className={css['editor-toolbar']}>
          <EditorToolbar />
        </div>
      */}
        <Editor tab={tab} spellId={spellId} />
      </div>
    </div>
  )
}

// Export the EditorWindow component
export default EditorWindow
