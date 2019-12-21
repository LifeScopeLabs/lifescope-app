class Cylinder {
    constructor(cellsPerRow=36, cellHeight=1, radius=1) {
        this.cellsPerRow = cellsPerRow;
        this.cellHeight = cellHeight;
        this.radius = radius;
    }

    cellPosition(cellIndexOrColumn, cellRow=undefined) {
        var row = cellRow == undefined ? this.getCellRow(cellIndexOrColumn) : cellRow;
        var theta = cellRow == undefined ? this.getCellTheta(cellIndexOrColumn) : this.getColumnTheta(cellIndexOrColumn);

        var x = this.radius * Math.sin(theta);
        var z = this.radius * Math.cos(theta);
        var y = row * this.cellHeight;

        return {x:x, y:y, z:z};
    }

    // Degrees
    cellRotation(cellIndex) {
        var theta = this.getCellTheta(cellIndex);

        var roty = theta * (180/Math.PI);
        var rotx = 0;
        var rotz = 0;

        return {x:rotx, y:roty, z:rotz};
    }

    // azimuthal angle
    getCellTheta(cellIndex) {
        var column = this.getCellColumn(cellIndex);
        var thetaPrime = 2 * Math.PI / this.cellsPerRow;
        return thetaPrime * column;
    }
    getColumnTheta(column) {
        return column * 2 * Math.PI / this.cellsPerRow;;
    }

    getCellColumn(cellIndex) {
        return Cylinder._mod(cellIndex, this.cellsPerRow);
    }

    getCellRow(cellIndex) {
        return Math.floor(cellIndex/this.cellsPerRow);
    }

    cellIndexFromColumnRow(column, row) {
        return column + (row * this.cellsPerRow);
    }

    static _mod(n, m) {
        return ((n % m) + m) % m;
    }
}

class CylindricalGrid extends Cylinder{
    constructor(cellsPerRow=36, cellHeight=1, radius=1, rows=1, columns=1) {
        super(cellsPerRow, cellHeight, radius);
        this.rows = rows;
        this.columns = columns;
    }

    cellIndex(subCellIndex, reverse=true) {
       if (reverse) {
        subCellIndex = (this.rows * this.columns - 1) - subCellIndex;
       }
       var sColumn =  Cylinder._mod(subCellIndex, this.columns);
       var sRow = Math.floor(subCellIndex/this.columns);

       var index = sColumn + (sRow * this.cellsPerRow);
       return index;
    }

    cellPosition(subCellIndex) {
        return super.cellPosition(this.cellIndex(subCellIndex));
    }
    cellRotation(subCellIndex) {
        return super.cellRotation(this.cellIndex(subCellIndex));
    }
}

export { Cylinder, CylindricalGrid };