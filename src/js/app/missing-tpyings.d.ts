declare module "dateformat" {
    var gulpPrint: any;
    export = gulpPrint;
}

// official @types lodash defs seem to break Map types (?)
declare module "lodash" {
    function _(args:any): any
    export = _
}