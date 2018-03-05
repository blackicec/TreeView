import { Component } from '@angular/core';
import { TreeViewElement } from '../models/TreeViewElement';

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
    isChecked: false
  };
  
  constructor() {
    this.treeViewModel = this.treeviewAsJson as TreeViewElement;
  }

  private OnActiveItemSelected(selectedItem: TreeViewElement): void {
    this.selectedItem = selectedItem;
  }

  private readonly treeviewAsJson: object = {
    id: 0,
    name: "Parent",
    children: [
      {
        id: 1,
        name: "Child1",
        children: [
          {
            id: 1.1,
            name: "Child1.1",
            children: []
          },
          {
            id: 1.2,
            name: "Child1.2",
            children: []
          }
        ]
      },
      {
        id: 2,
        name: "Child2",
        children: []
      },
      {
        id: 3,
        name: "Child3",
        children: [
          {
            id: 3.1,
            name: "Grandchild3.1",
            children: [
              {
                id: 3.2,
                name: "Great Grandchild3.1.1",
                children: []
              }
            ]
          },
          {
            id: 3.3,
            name: "Grandchild3.2",
            children: [
              {
                id: 3.4,
                name: "Great Grandchild3.2.1",
                children: [
                  {
                    id: 3.5,
                    name: "Great Great Grandchild3.2.1.1",
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}
