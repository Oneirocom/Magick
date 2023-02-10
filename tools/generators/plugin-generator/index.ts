import { Tree, formatFiles, generateFiles, installPackagesTask, joinPathFragments, names } from '@nrwl/devkit'
import { libraryGenerator } from '@nrwl/workspace/generators'

export interface PluginStruct {
  name: string; 
  services: boolean;
  nodes: boolean;
}

export default async function (tree: Tree, schema: PluginStruct) {
  await libraryGenerator(tree, { name: schema.name })
  await generateFiles(
    tree,
    joinPathFragments(__dirname, './files/'),
    'packages/' + schema.name + "/",
    names(schema.name) // {name: 'my-name', className: 'MyName', propertyName: 'myName', constantName: 'MY_NAME', fileName: 'my-name'}
  );
  await formatFiles(tree)
  return () => {
    installPackagesTask(tree)
  }
}
