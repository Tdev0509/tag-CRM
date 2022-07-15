import { Component, OnInit } from "@angular/core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionComponent } from './permission/permission.component';
import { SnackbarService } from 'src/app/shared/service/snackbar.service';
import { ActivatedRoute } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: "Super Admin" },
  { position: 2, name: "Admin" },
  { position: 3, name: "Publisher" },
  { position: 4, name: "Advertiser" },
];

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ["position", "name", "action"];
  dataSource = ELEMENT_DATA;
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private sS: SnackbarService,
  ) {}

  ngOnInit(): void {}

  openManagePermissionDialog(roleKey) {
    const modalRef = this.modalService.open(PermissionComponent, {
      size: 'md',
    });
    modalRef.componentInstance.data = {
      id: roleKey
    };
    modalRef.result.then((c) => {});
  }
}
