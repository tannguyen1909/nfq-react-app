export function convertArrayToCSV(data) {  
    let result = '', 
        ctr, keys, 
        columnDelimiter = ';', 
        lineDelimiter = '\n';

    if (data == null || !data.length) {
        return null;
    }

    keys = Object.keys(data[0]);

    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach((item) => {
        ctr = 0;
        keys.forEach((key) => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

export class CSV {

    static getCSV(data) {
        let csv = convertArrayToCSV(data);
        
        if (csv == null) return;

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        return encodeURI(csv);
    }

    static convertArrayToCSV(data) {  
        let result = '', 
            ctr, keys, 
            columnDelimiter = ';', 
            lineDelimiter = '\n';
    
        if (data == null || !data.length) {
            return null;
        }
    
        keys = Object.keys(data[0]);
    
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
    
        data.forEach((item) => {
            ctr = 0;
            keys.forEach((key) => {
                if (ctr > 0) result += columnDelimiter;
    
                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });
    
        return result;
    }
}