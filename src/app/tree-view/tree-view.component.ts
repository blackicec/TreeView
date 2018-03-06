import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TreeViewElement, TreewViewElementConfiguration } from '../../models/TreeViewElement';
import { ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'tree-view', 
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TreeViewComponent implements OnInit {
    @Input() treeViewModel: TreeViewElement;
    @Input() viewConfiguration: TreewViewElementConfiguration;
    @Output() onActiveItemChanged: EventEmitter<TreeViewElement> = new EventEmitter<TreeViewElement>();
    @Output() onItemCheckedChanged: EventEmitter<TreeViewElement> = new EventEmitter<TreeViewElement>();

    private treeviewElementName: string = "treeview";
    private readonly activeNodeClassName: string = "treeview-active-node";
    private activeNode: HTMLSpanElement;

    public ngOnInit(): void {
        if(this.treeViewModel === undefined || this.treeViewModel === null) {
            throw new Error("TreeView data model not set.");
        } else if(this.viewConfiguration === undefined || this.viewConfiguration === null) {
            throw new Error("TreeView view configuration not set.");
        }
        
        this.setConfigurationDefaults();
        
        let element = this.buildHtmlView(this.treeViewModel);

        // Now take our fully built tree and append it to the UI
        document.getElementById(this.treeviewElementName).appendChild(element);
    }

    private buildHtmlView(model: TreeViewElement): HTMLLIElement {
        let newTreeNode: HTMLLIElement = document.createElement("li")
        let dropDownIndicator: HTMLAnchorElement = document.createElement("a")
        let dropDownIcon: HTMLElement = document.createElement("i");
        let nodeName: HTMLSpanElement = document.createElement("span");
        let checkboxSelector: HTMLInputElement = document.createElement("input");

        dropDownIndicator.setAttribute("name", "treeview-expansion-icon");
        dropDownIndicator.appendChild(dropDownIcon);

        // Added fa and fas to make compatible with FontAwesome 4 and 5
        dropDownIcon.classList.add('fa', 'fas', this.viewConfiguration.expandedIconClass);

        nodeName.innerText = model[this.viewConfiguration.displayName];
        nodeName.style.borderLeftColor = this.viewConfiguration.activeNodeIndicatorColor;
        nodeName.setAttribute("name", "treeview-node-name");
        nodeName.addEventListener("click", () => {
            this.onActiveNodeChange(model, nodeName);
        })

        if(this.viewConfiguration.displayCheckableOption) {
            checkboxSelector.setAttribute("type", "checkbox");
            checkboxSelector.addEventListener("click", () => {
                this.onItemCheckedChange(model, checkboxSelector);
            })
        }
        
        if(model.children != undefined && model.children != null && model.children.length > 0) {
            let childRootList: HTMLUListElement = document.createElement("ul");

            newTreeNode.appendChild(childRootList);

            dropDownIndicator.addEventListener("click", () => {
                this.onChildViewChange(model, childRootList);
            });            
            
            model.children.forEach(element => {
                newTreeNode.appendChild(dropDownIndicator);

                if(this.viewConfiguration.displayCheckableOption && model.isRoot !== true) {
                    newTreeNode.appendChild(checkboxSelector);
                }

                if(model.isCollapsed) {
                    //console.log('Node collapsed: ', newTreeNode);
                    //newTreeNode.classList.add('collapse-');
                    // TODO: Revisit collapsed state
                }
                
                newTreeNode.appendChild(nodeName);

                // create the children of this child tree node
                childRootList.appendChild(this.buildHtmlView(element));

                newTreeNode.appendChild(childRootList);
            });
        } else {
            if(this.viewConfiguration.displayCheckableOption) {
                newTreeNode.appendChild(checkboxSelector);
            }

            newTreeNode.appendChild(nodeName);
        }       

        return newTreeNode;
    }

    private onChildViewChange(element: TreeViewElement, childRootList: HTMLUListElement): void {
        // First we change the icon to express the open/collapsed state, then we perform the action
        // Get the parent, which will be a list item based on our layout
        let parent: HTMLLIElement = childRootList.parentElement as HTMLLIElement;
        let iconAnchor: Element = parent.children.namedItem("treeview-expansion-icon");

        if(iconAnchor != undefined) {
            let icon: Element = iconAnchor.firstElementChild;
            icon.classList.toggle(this.viewConfiguration.expandableIconClass);
            icon.classList.toggle(this.viewConfiguration.expandedIconClass);
        }

        for(var index = 0; index < childRootList.children.length; ++index) {
            try {
                var listChildItem: HTMLLIElement = childRootList.children[index] as HTMLLIElement;
                listChildItem.classList.toggle("collapse");
            } catch {
                throw new Error("List Item casting failed on item id: " + element.id);
            }            
        }
    }

    private onItemCheckedChange(element: TreeViewElement, checkbox: HTMLInputElement) {
        element.isChecked = checkbox.checked;
        this.onItemCheckedChanged.emit(element);
    }

    private onActiveNodeChange(element: TreeViewElement, activeSpan: HTMLSpanElement): void {
        if(element.isRoot === true || this.activeNode === activeSpan) {
            // No need to raise an event since this element is already active
            return;
        }
        
        // First we need to clear out any existing active elements
        this.changeActiveNode(activeSpan);

        this.activeNode = activeSpan;
        this.onActiveItemChanged.emit(element);
    }

    private changeActiveNode(activeSpan: HTMLSpanElement) {
        let elementList: HTMLCollection = document.getElementsByClassName(this.activeNodeClassName);

        for(let index = 0; index < elementList.length; ++index) {
            elementList.item(index).classList.remove(this.activeNodeClassName);
        }

        activeSpan.classList.add(this.activeNodeClassName);
    }

    private setConfigurationDefaults() {
        if(this.viewConfiguration.widthInPixels === undefined) {
            this.viewConfiguration.widthInPixels = 350;
        }

        if(this.viewConfiguration.heightInPixels === undefined) {
            this.viewConfiguration.heightInPixels = 500;
        }

        let treeviewWrapper: HTMLElement = document.getElementById('treeview_wrapper');

        treeviewWrapper.style.width = this.viewConfiguration.widthInPixels + 'px';
        treeviewWrapper.style.height = this.viewConfiguration.heightInPixels + 'px';
    }
}