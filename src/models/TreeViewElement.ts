
export interface TreeViewElement {
    id: number;
    name: string;
    children: TreeViewElement[];
    isActive: boolean;
    isChecked: boolean;
}

export interface TreewViewElementConfiguration {
    idName: string;
    displayName: string;
    childrenArrayName: string;
    expandableIconClass: string;
    expandedIconClass: string;
    displayCheckableOption: boolean;
}