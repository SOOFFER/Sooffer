var fs = require('fs');
var _ = require('lodash');
const serviceAccount = require('./service-account.json');
const zipFolder = require('zip-folder');
const { google } = require('googleapis');

var exec = require('child_process').exec;
var dbOptions = {
    user: ' ',
    pass: ' ',
    host: 'localhost',
    port: 27017,
    database: 'rebustarv2serverenterprise',
    autoBackup: true,
    removeOldBackup: true,
    keepLastDaysBackup: 5,
    autoBackupPath: '/home/ubuntu/alo-app/database-backup/',
    parents: ['17_uyTqFlpZvWMiY2H8t2VlBN1QHjvz--'],
    needTouploadDrive: true,

};
/* return date object */
export const stringToDate = function (dateString) {
    return new Date(dateString);
}
/* return if variable is empty or not. */
export const empty = function (mixedVar) {
    var undef, key, i, len;
    var emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
            return false;
        }
        return true;
    }
    return false;
};
// Auto backup script
export const dbAutoBackUp = () => {
    // check for auto backup is enabled or disabled
    if (dbOptions.autoBackup == true) {
        var date = new Date();
        var beforeDate, oldBackupDir, oldBackupPath;
        var currentDate = stringToDate(date); // Current date
        var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup == true) {
            beforeDate = _.clone(currentDate);
            beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
            oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
            oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
        }
        // var cmd = 'mongodump --db ' + dbOptions.database + ' --out ' + newBackupPath; // Command for mongodb dump process
        var cmd = 'mongodump  --username myUserAdmin --password  xFTS1SOH8WLQEYBy --authenticationDatabase admin --db rebustarv2serverenterprise --out ' + newBackupPath
        console.log('cmd', cmd)
        // sudo mongodump --db abservetech --out /home/abservetechvps/public_html/star/server/DB/
        exec(cmd, function (error, stdout, stderr) {
            console.log("error", error)
            if (empty(error)) {
                if (dbOptions.needTouploadDrive == true) {
                    zipDBFloder(newBackupPath, newBackupDir);

                }
                // check for remove old backup after keeping # of days given in configuration
                if (dbOptions.removeOldBackup == true) {
                    if (fs.existsSync(oldBackupPath)) {
                        exec("rm -rf " + oldBackupPath, function (err) { });
                    }
                }
            }
        });
    }
}


export const zipDBFloder = (newPath, name, ) => {
    zipFolder(newPath, newPath + '.zip', function (err) {
        if (err) {
            console.log("err", err);
        } else {
            addInDrive(newPath + '.zip', name);
        }
    });
}
export const addInDrive = (newPath, name) => {
    var fileMetadata = {
        'name': "Alo"+'-'+name,
        'mimeType': 'application/zip',
        parents: dbOptions.parents
    };
    var media = {
        mimeType: 'application/zip',
        body: fs.createReadStream(newPath)
    };
    const jWTClient = new google.auth.JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file'],
    )
    google.drive({ version: 'v3' })
        .files.create({
            auth: jWTClient,
            media: media,
            resource: fileMetadata,
            fields: 'id',
        }).then(function (resp) {
            console.log("successfully uploaed in drive ");
            if (dbOptions.removeOldBackup == true) {
                exec("rm -rf " + newPath, function (err) {
                    console.log("exec call back  in success", err)
                });
            }
        }).catch(function (error) {
            if (empty(error)) {
                if (dbOptions.removeOldBackup == true) {
                    exec("rm -rf " + newPath, function (err) {
                        console.log("exec call back  in error", err)
                    });
                }
            }
            else console.log("There is a Problem", error)
        });
}
//https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=616628085451&pli=1
