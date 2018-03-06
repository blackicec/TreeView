import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewComponent } from './tree-view.component';
import { TreeViewElement } from '../../models/TreeViewElement'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TreeViewComponent],
  exports: [
    TreeViewComponent
  ]
})
export class TreeViewModule { }
