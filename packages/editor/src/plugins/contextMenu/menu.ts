// DOCUMENTED
/**
 * The Menu class provides an abstract base class for menus in the editor.
 */
export default abstract class Menu {
  /**
   * Creates an instance of the Menu class
   * @param editor - The editor instance to which the menu belongs to
   * @param props - The properties of the menu
   */
  constructor(editor: any, props: any) {
    if (this.constructor === Menu) {
      throw new TypeError(
        'Abstract class "Menu" cannot be instantiated directly'
      )
    }
  }

  /**
   * Adds an item to the menu.
   * @param title - The title of the menu item
   * @param onClick - The callback function to execute when the item is clicked
   * @param path - Optional parameter to specify the icon path
   */
  addItem(title: string, onClick: () => void, path?: string[]): void {
    /* null */
  }

  /**
   * Displays the menu at the specified x and y coordinates
   * @param x - The x-coordinate to position the menu
   * @param y - The y-coordinate to position the menu
   * @param args - Additional arguments to pass to the menu
   */
  show(x: number, y: number, args: any): void {
    /* null */
  }

  /**
   * Hides the menu from view
   */
  hide(): void {
    /* null */
  }
}
