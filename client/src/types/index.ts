
export interface EnhancedTableToolbarProps {
    tabType:string;
    numSelected: number;
    description:string;
    selected:any;
    rows: Data[]; 
    dynamicKey: string; 
    actionButtons:boolean;
    reloadActiveTab: ()=> Void
}

export interface HeadCell {
    id: string;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
}

export interface Data {
    id: number;
    [key: string]: any; // Dynamic keys for additional columns
}
