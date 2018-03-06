
export interface TreeViewElement {
    id: number;
    name: string;
    children: TreeViewElement[];
    isActive: boolean;
    isChecked: boolean;
    isCollapsed: boolean;
    isRoot?: boolean;
}

export interface TreewViewElementConfiguration {
    idName: string;
    displayName: string;
    childrenArrayName: string;
    expandableIconClass: string;
    expandedIconClass: string;
    parentIconClass: string;
    leafIconClass: string;
    displayCheckableOption: boolean;
    activeNodeIndicatorColor: string;
    widthInPixels?: number;
    heightInPixels?: number;
}