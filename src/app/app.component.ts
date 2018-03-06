import { Component } from '@angular/core';
import { TreeViewElement, TreewViewElementConfiguration } from '../models/TreeViewElement';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private title = 'Test Application';
  private treeViewModel: TreeViewElement;
  private selectedItem: TreeViewElement = {
    name: '',
    id: 2,
    children: [],
    isActive: false,
    isChecked: false,
    isCollapsed: false
  };

  constructor() {
    this.treeViewModel = this.treeviewAsJson as TreeViewElement;
  }

  private OnActiveItemSelected(selectedItem: TreeViewElement): void {
    this.selectedItem = selectedItem;
  }

  private configuration: TreewViewElementConfiguration = {
    idName: 'id',
    displayName: 'name',
    childrenArrayName: 'children',
    displayCheckableOption: true,
    expandableIconClass: 'fa-angle-double-right',
    expandedIconClass: 'fa-angle-double-down',
    parentIconClass: 'fa-folder',
    leafIconClass: 'fa-folder-open',
    activeNodeIndicatorColor: '#0099ff'
  }

  private readonly treeviewAsJson: TreeViewElement = {
    id: 0,
    name: "Dragons",
    isActive: false,
    isChecked: false,
    isCollapsed: false,
    isRoot: true,
    children: [
      {
        id: 1,
        name: "Dragon Fire",
        isActive: false,
        isChecked: false,
        isCollapsed: false,
        children: [
          {
            id: 1.1,
            name: "Blue Flames",
            isActive: false,
            isChecked: false,
            isCollapsed: false,
            children: []
          },
          {
            id: 1.2,
            name: "Red Flames",
            isActive: false,
            isChecked: false,
            isCollapsed: false,
            children: []
          }
        ]
      },
      {
        id: 2,
        name: "Dragon Scales",
        isActive: false,
        isChecked: false,
        isCollapsed: false,
        children: []
      },
      {
        id: 3,
        name: "Dragon Blades",
        isActive: false,
        isChecked: false,
        isCollapsed: false,
        children: [
          {
            id: 3.1,
            name: "Two Handed",
            isActive: false,
            isChecked: false,
            isCollapsed: false,
            children: [
              {
                id: 3.2,
                name: "Broad Swords",
                isActive: false,
                isChecked: false,
                isCollapsed: false,
                children: []
              },
              {
                id: 3.3,
                name: "Axes",
                isActive: false,
                isChecked: false,
                isCollapsed: false,
                children: []
              }
            ]
          },
          {
            id: 3.4,
            name: "One Handed",
            isActive: false,
            isChecked: false,
            isCollapsed: false,
            children: [
              {
                id: 3.5,
                name: "Dragon Infinity Sword",
                isActive: false,
                isChecked: false,
                isCollapsed: true,
                children: [
                  {
                    id: 3.6,
                    name: "Hunter's Axe",
                    isActive: false,
                    isChecked: false,
                    isCollapsed: false,
                    children: []
                  }
                ]
              }              
            ]
          },
          {
            id: 3.7,
            name: "Specialty",
            isActive: false,
            isChecked: false,
            isCollapsed: false,
            children: [
              {
                id: 3.8,
                name: "Throwing Daggers",
                isActive: false,
                isChecked: false,
                isCollapsed: true,
                children: null
              },
              {
                id: 3.9,
                name: "Scale Grenades",
                isActive: false,
                isChecked: false,
                isCollapsed: false,
                children: []
              }  
            ]
          }
        ]
      }
    ]
  };
}
