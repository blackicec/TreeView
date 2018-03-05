import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TreeViewElement, TreewViewElementConfiguration } from '../../models/TreeViewElement';
import { ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'treeview', 
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TreeViewComponent implements OnInit {
    @Input() treeViewModel: TreeViewElement;
    @Output() onActiveItemChanged: EventEmitter<TreeViewElement> = new EventEmitter<TreeViewElement>();
    @Output() onItemCheckedChanged: EventEmitter<TreeViewElement> = new EventEmitter<TreeViewElement>();

    private treeviewElementName: string = "treeview";
    private configuration: TreewViewElementConfiguration;
    private activeNode: string;

    public ngOnInit(): void {
        if(this.treeViewModel === undefined || this.treeViewModel === null) {
            throw new Error("TreeView data model not set.");
        }

        this.configuration = {
            idName: 'id',
            displayName: 'name',
            childrenArrayName: 'children',
            displayCheckableOption: true,
            expandableIconClass: 'fa-folder',
            expandedIconClass: 'fa-folder-open'
        }

        let treeViewElement: HTMLDivElement = document.createElement("div");
        let element = this.BuildHtmlView(this.treeViewModel);

        // Now take our fully built tree and append it to the UI
        document.getElementById(this.treeviewElementName).appendChild(element);

        // Collapse the view
        this.CollapseAll();
    }

    private BuildHtmlView(model: TreeViewElement): HTMLLIElement {
        let newTreeNode: HTMLLIElement = document.createElement("li")
        let dropDownIndicator: HTMLAnchorElement = document.createElement("a")
        let dropDownIcon: HTMLElement = document.createElement("i");
        let nodeName: HTMLSpanElement = document.createElement("span");
        let checkboxSelector: HTMLInputElement = document.createElement("input");

        dropDownIndicator.setAttribute("name", "tree-expansion-icon");
        dropDownIndicator.appendChild(dropDownIcon);

        // Added fa and fas to make compatible with FontAwesome 4 and 5
        dropDownIcon.classList.add('fa', 'fas', this.configuration.expandedIconClass);

        nodeName.innerText = model[this.configuration.displayName]; // TODO: Add click event to this span node
        nodeName.addEventListener("click", () => {
            this.OnActiveNodeChange(model);
        })

        if(this.configuration.displayCheckableOption) {
            checkboxSelector.setAttribute("type", "checkbox");
            checkboxSelector.addEventListener("click", () => {
                this.OnItemChecked(model);
            })
        }
        
        if(model.children != undefined && model.children != null && model.children.length > 0) {
            let childRootList: HTMLUListElement = document.createElement("ul");

            newTreeNode.appendChild(childRootList);

            dropDownIndicator.addEventListener("click", () => {
                this.OnChildViewChange(model, childRootList);
            })
            
            model.children.forEach(element => {
                newTreeNode.appendChild(dropDownIndicator);
                newTreeNode.appendChild(checkboxSelector);
                newTreeNode.appendChild(nodeName);

                // create the children of this child tree node
                childRootList.appendChild(this.BuildHtmlView(element));

                newTreeNode.appendChild(childRootList);
            });
        } else {
            newTreeNode.appendChild(checkboxSelector);
            newTreeNode.appendChild(nodeName);
        }       

        return newTreeNode;
    }

    private CollapseAll(parent: HTMLUListElement = undefined) {
        let parentNode: HTMLUListElement;

        // If the parent is undefined, then we must be starting at the root node
        if(parent === undefined) {
            parentNode = document.getElementById(this.treeviewElementName) as HTMLUListElement;
        } else {
            parentNode = parent;
        }

        for(var index = 0; index < parentNode.children.length; ++index) {
            let childNode: Element = parentNode.children[index];
            
            console.log(parentNode.tagName);
            if(childNode.tagName == "LI") {
                if(parentNode.id !== this.treeviewElementName) {
                    childNode.classList.toggle("collapse");
                }                
                
                if(childNode.children.length > 0) {
                    this.CollapseAll(childNode.firstElementChild as HTMLUListElement);
                }
            }            
        }
    }

    private OnChildViewChange(element: TreeViewElement, childRootList: HTMLUListElement): void {
        console.log(element);
        // First we change the icon to express the open/collapsed state, then we perform the action

        // Get the parent, which will be a list item based on our layout
        let parent: HTMLLIElement = childRootList.parentElement as HTMLLIElement;
        let iconAnchor: Element = parent.children.namedItem("tree-expansion-icon");

        if(iconAnchor != undefined) {
            let icon: Element = iconAnchor.firstElementChild;
            icon.classList.toggle(this.configuration.expandableIconClass);
            icon.classList.toggle(this.configuration.expandedIconClass);
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

    private OnItemChecked(element: TreeViewElement) {

    }

    private OnActiveNodeChange(element: TreeViewElement): void {
        if(this.activeNode === element[this.configuration.idName]) {
            // No need to raise an event since this element is already active
            return;
        }

        this.activeNode = element[this.configuration.idName];
        this.onActiveItemChanged.emit(element);
    }
}