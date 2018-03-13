import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TreeViewElement, TreewViewElementConfiguration } from './TreeViewElement';
import { ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'tree-view', 
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TreeViewComponent implements OnInit {
    @Input()
    set treeViewModel(model: TreeViewElement) {
        this.model = model;

        // No need to rebuild the tree if this view has not been initailized yet
        if(!this.isInitialized) {
            return;
        }

        // Clear out existing tree and rebuild it
        let treeView: Element = document.getElementById("treeview");

        if(treeView.firstElementChild) {
            treeView.firstElementChild.remove();
        }

        // Now rebuild the tree with the new Model
        treeView.appendChild(this.buildHtmlView(this.model));
    }
    get treeViewModel(){
        return this.model;
    }
    
    @Input() viewConfiguration: TreewViewElementConfiguration;
    @Input() activeItemId: any;

    @Output() onActiveItemChanged: EventEmitter<TreeViewElement> = new EventEmitter<TreeViewElement>();
    @Output() onItemCheckedChanged: EventEmitter<TreeViewElement> = new EventEmitter<TreeViewElement>();

    private model: TreeViewElement;
    private treeviewElementName: string = "treeview";
    private readonly activeNodeClassName: string = "treeview-active-node";
    private activeNode: HTMLSpanElement;
    private isInitialized: boolean = false;

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

        this.isInitialized = true;
    }

    private buildHtmlView(model: TreeViewElement): HTMLLIElement {

        // Not really anything to do without a configuration files
        if(this.viewConfiguration === undefined || this.viewConfiguration === null) {
            return document.createElement("li");
        }

        let newTreeNode: HTMLLIElement = document.createElement("li");
        let dropDownIndicator: HTMLAnchorElement = document.createElement("a");
        let dropDownIcon: HTMLElement = document.createElement("i");
        let parentIcon: HTMLElement = document.createElement("i");
        let leafIcon: HTMLElement = document.createElement("i");
        let nodeName: HTMLSpanElement = document.createElement("span");
        let checkboxSelector: HTMLInputElement = document.createElement("input");

        dropDownIndicator.setAttribute("name", "treeview-expansion-icon");
        dropDownIndicator.appendChild(dropDownIcon);

        // Added fa and fas to make compatible with FontAwesome 4 and 5
        dropDownIcon.classList.add('fa', 'fas', this.viewConfiguration.expandedIconClass);

        nodeName.innerText = model[this.viewConfiguration.displayName];
        nodeName.style.borderLeftColor = this.viewConfiguration.activeNodeIndicatorColor;
        nodeName.setAttribute("name", "treeview-node-name");

        if(model.isRoot !== true) {
            nodeName.addEventListener("click", () => {
                this.onActiveNodeChange(model, nodeName);
            })
        }
        
        if(model.isActive || this.activeItemId == model.id) {
            this.changeActiveNode(nodeName);
        }

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
                    // TODO: Revisit collapsed state
                }

                // Add a parent icon if desired
                if(this.viewConfiguration.parentIconClass && this.viewConfiguration.parentIconClass !== '') {
                    parentIcon.classList.add('fa', 'fas', this.viewConfiguration.parentIconClass);
                    newTreeNode.appendChild(parentIcon);
                }
                
                newTreeNode.appendChild(nodeName);

                // create the children of this child tree node
                childRootList.appendChild(this.buildHtmlView(element));

                newTreeNode.appendChild(childRootList);

                //TODO: Collapse: this.onChildViewChange(model, childRootList);
            });
        } else {
            if(this.viewConfiguration.displayCheckableOption) {
                newTreeNode.appendChild(checkboxSelector);
            }

            if(this.viewConfiguration.leafIconClass && this.viewConfiguration.leafIconClass !== '') {
                leafIcon.classList.add('fa', 'fas', this.viewConfiguration.leafIconClass);
                newTreeNode.appendChild(leafIcon);
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

        if(iconAnchor != undefined && iconAnchor != null) {
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
            this.viewConfiguration.widthInPixels = '100%';
        }

        if(this.viewConfiguration.heightInPixels === undefined) {
            this.viewConfiguration.heightInPixels = '500px';
        }

        let treeviewWrapper: HTMLElement = document.getElementById('treeview_wrapper');

        treeviewWrapper.style.width = this.viewConfiguration.widthInPixels;
        treeviewWrapper.style.height = this.viewConfiguration.heightInPixels;
    }
}