const { text } = require('body-parser')
const express = require('express')
const router = express.Router()

const allFiles = {
  folders: {
    "test-reports": {
      name: "testconsignment",
      folders: {
        "test-2-reports": {
          name: "test reports",
          folders: {
            "test-annual": {
              name: "annual test reports",
              folders: {
                "test-annual-supplements": {
                  name: "test supplementary information",
                  folders: {},
                  files: {
                    "test-annual-supplement-1": {
                      name: "Appendix 1.txt",
                      language: "English",
                      copyright:"Crown Copyright",
                      status: "Public Record",
                      filepath:"/home/admin/transfers",
                      datelast: "25/05/2020",
                      checksum:"SHA256",
                      icon: "🧾"
                    },
                    "test-annual-supplement-2": {
                      name: "Appendix 2.txt",
                      language: "English",
                      copyright:"Crown Copyright",
                      status: "Public Record",
                      filepath:"/home/admin/transfers",
                      datelast: "25/05/2020",
                      checksum:"SHA256",
                      icon: "🧾"
                    }
                  }
                }
              },
              files: {
                "test-2005": {
                  name: "test report 2005.docx",
                  language: "English",
                  copyright:"Crown Copyright",
                  status: "Public Record",
                  filepath:"/home/admin/transfers",
                  datelast: "25/05/2020",
                  checksum:"SHA256",
                  icon: "🧾"
                },
                "test-2006": {
                  name: "test report 2006.docx",
                  language: "English",
                  copyright:"Crown Copyright",
                  status: "Public Record",
                  filepath:"/home/admin/transfers",
                  datelast: "25/05/2020",
                  checksum:"SHA256",
                  icon: "🧾"
                },
              }
            }
          },
          files: {
            "test-photo": {
              name: "test photo.png",
              language: "English",
              copyright:"Crown Copyright",
              status: "Public Record",
              filepath:"/home/admin/transfers",
              datelast: "25/05/2020",
              checksum:"SHA256",
              icon: "🖼️"
            }
          }
        },
        "test-reports": {
          name: "test reports",
          folders: {},
          files: {
            "test-photo": {
              name: "test test test photo.png",
              language: "English",
              copyright:"Crown Copyright",
              status: "Public Record",
              filepath:"/home/admin/transfers",
              datelast: "25/05/2020",
              checksum:"SHA256",
              icon: "🖼️"
            },
            "test-with-test": {
              name: "test with test photo.jpg",
              language: "English",
              copyright:"Crown Copyright",
              status: "Public Record",
              filepath:"/home/admin/transfers",
              datelast: "25/05/2020",
              checksum:"SHA256",
              icon: "🖼️"
            }
          }
        }
      },
      files: {
        "annual-report": {
          name: "Annual report.docx",
          language: "English",
          copyright:"Crown Copyright",
          status: "Public Record",
          filepath:"/home/admin/transfers",
          datelast: "25/05/2020",
          checksum:"SHA256",
          icon: "🧾"
        },
        "stats": {
          name: "Statistics.xlsx",
          language: "English",
          copyright:"Crown Copyright",
          status: "Public Record",
          filepath:"/home/admin/transfers",
          datelast: "25/05/2020",
          checksum:"SHA256",
          icon: "📊"
        },
        "test click photo": {
          name: "test click photo.jpg",
          language: "English",
          copyright:"Crown Copyright",
          status: "Public Record",
          filepath:"/home/admin/transfers",
          datelast: "25/05/2020",
          checksum:"SHA256",
          icon: "🖼️"
        },
      }
    }
  }
}

const prepopFields = {
  language: { name: "Language", fieldType: "radio"},
  legalStatus: { name: "Legal status", fieldType: "radio"},
  copyright: { name: "Copyright", fieldType: "radio"}
}

const allowedFields = {
  dateCreated: { name: "Original creation date", fieldType: "date" },
  dateRange: { name: "Date range", fieldType: "daterange" },
  creatingBody: { name: "Creating body", fieldType: "input" },
  summary: { name: "Summary", fieldType: "text" }
}

const allowedClosureFields = {
  closureType: { name: "Closure type", fieldType: "input" },
  closurePeriod: { name: "Closure period", fieldType: "daterange" },
  closureStartDate: { name: "Closure start date", fieldType: "date" },
  FOIexemptionCode: { name: "FOI exemption code", fieldType: "input" },
  descriptionPublic: { name: "Description public", fieldType: "text"}
}

const getFiles = (files, pathParts) => {
  if (pathParts.length == 0) {
    return files;
  } else {
    const nextFiles = files.folders[pathParts[0]];
    return getFiles(nextFiles, pathParts.slice(1));
  }
}

const getBreadcrumbs = (breadcrumbs, files, pathParts) => {
  if (pathParts.length == 0) {
    return breadcrumbs;
  } else {
    const folderId = pathParts[0]
    const nextFolder = files.folders[folderId];
    const pathSoFar = breadcrumbs.map(breadcrumb => breadcrumb.id)
    const nextPath = pathSoFar.concat(folderId).join("%2F");
    const nextBreadcrumbs = breadcrumbs.concat({
      path: nextPath,
      id: folderId,
      name: nextFolder.name
    });
    return getBreadcrumbs(nextBreadcrumbs, nextFolder, pathParts.slice(1));
  }
}

const getFileBreadcrumbs = (breadcrumbs, files, pathParts) => {
  if (pathParts.length === 1) {
    const fileId = pathParts[0];
    const file = files.files[fileId];
    const pathSoFar = breadcrumbs.map(breadcrumb => breadcrumb.id)
    const nextPath = pathSoFar.concat(fileId).join("%2F");
    const fileBreadcrumbs = breadcrumbs.concat({
      path: nextPath,
      id: fileId,
      name: file.name
    });
    return fileBreadcrumbs;
  } else {
    const folderId = pathParts[0]
    const nextFolder = files.folders[folderId];
    const pathSoFar = breadcrumbs.map(breadcrumb => breadcrumb.id)
    const nextPath = pathSoFar.concat(folderId).join("%2F");
    const nextBreadcrumbs = breadcrumbs.concat({
      path: nextPath,
      id: folderId,
      name: nextFolder.name
    });
    return getFileBreadcrumbs(nextBreadcrumbs, nextFolder, pathParts.slice(1));
  }
}

const countFiles = (parentFolder) => {
  return getFilesInFolder(parentFolder).length;
}

const getFilesInFolderRecursive = (parentFolders, fileIds) => {
  const childFolderGroups = parentFolders
    .map(folder => Object.values(folder.folders))
    .flat();
  const newFileIds = fileIds.concat(
    parentFolders.map(folder => Object.keys(folder.files))
  ).flat();

  if (childFolderGroups.length == 0) {
    return newFileIds;
  } else {
    return getFilesInFolderRecursive(childFolderGroups, newFileIds);
  }
}

const getFilesInFolder = (parentFolder) => {
  return getFilesInFolderRecursive([parentFolder], []);
}

const getFolderMetadata = (fileIds, allFileMetadata) => {
  const folderMetadata = {};

  Object.keys(allowedFields).forEach(fieldId => {
    const fieldValues = [];

    fileIds.forEach(fileId => {
      const fileMetadata = allFileMetadata[fileId] || {};
      const metadataValue = fileMetadata[fieldId] || null;

      if (!fieldValues.includes(metadataValue)) {
        fieldValues.push(metadataValue);
      }
    });

    folderMetadata[fieldId] = fieldValues;
  });

  const filteredMetadata = {};

  Object.keys(folderMetadata).forEach(fieldId => {
    const metadataForField = folderMetadata[fieldId];

    if (metadataForField.length === 1) {
      if (metadataForField[0] !== null) {
        filteredMetadata[fieldId] = metadataForField[0]
      }
    } else {
      filteredMetadata[fieldId] = "Varies by file";
    }
  });

  return filteredMetadata;
}

const getFolderClosureMetadata = (fileIds, allFileMetadata) => {
  const folderClosureMetadata = {};

  Object.keys(allowedClosureFields).forEach(closureFieldId => {
    const closureFieldValues = [];

    fileIds.forEach(fileId => {
      const fileMetadata = allFileMetadata[fileId] || {};
      const metadataValue = fileMetadata[closureFieldId] || null;

      if (!closureFieldValues.includes(metadataValue)) {
        closureFieldValues.push(metadataValue);
      }
    });

    folderClosureMetadata[closureFieldId] = closureFieldValues;
  });

  const filteredClosureMetadata = {};

  Object.keys(folderClosureMetadata).forEach(closureFieldId => {
    const metadataForField = folderClosureMetadata[closureFieldId];

    if (metadataForField.length === 1) {
      if (metadataForField[0] !== null) {
        filteredClosureMetadata[closureFieldId] = metadataForField[0]
      }
    } else {
      filteredClosureMetadata[closureFieldId] = "Varies by file";
    }
  });

  return filteredClosureMetadata;
}

// Add your routes here - above the module.exports line

router.get('/', function (req, res) {
  res.redirect("index");
})

router.get("/summary", function (req, res) {
  const parentFolder = allFiles.folders[Object.keys(allFiles.folders)[0]]
  const totalFiles = countFiles(parentFolder);
  const parentFolderName = parentFolder.name;

  res.render("summary", {
    totalFiles: totalFiles,
    parentFolderName: parentFolderName
  });
});

router.get('/home-metadata/:path', function (req, res) {
  const pathParts = req.params.path.split("/");
  const files = getFiles(allFiles, pathParts);

  if (!files) {
    // Assume this is is not a folder, so redirect to the files page
    res.redirect(`/file-summary/${pathParts.join("%2F")}`);
  }
  console.log("Files:", files);

  const breadcrumbs = getBreadcrumbs([], allFiles, pathParts);

  res.render('home-metadata', {
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    contents: files,
    countFiles: countFiles
  });
});

router.get('/browse/:path', function (req, res) {
  const pathParts = req.params.path.split("/");
  const files = getFiles(allFiles, pathParts);

  if (!files) {
    // Assume this is is not a folder, so redirect to the files page
    res.redirect(`/file-summary/${pathParts.join("%2F")}`);
  }
  console.log("Files:", files);

  const breadcrumbs = getBreadcrumbs([], allFiles, pathParts);

  res.render('browse', {
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    contents: files,
    countFiles: countFiles
  });
});

router.get('/edit-folder/:path', function (req, res) {
  const pathParts = req.params.path.split("/");
  const files = getFiles(allFiles, pathParts);
  const breadcrumbs = getBreadcrumbs([], allFiles, pathParts);

  const fileIds = getFilesInFolder(files);
  const folderMetadata = getFolderMetadata(fileIds, req.session.data.fileMetadata || {});
  const folderClosureMetadata = getFolderClosureMetadata(fileIds, req.session.data.fileMetadata || {});

  res.render('edit-folder', {
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    contents: files,
    countFiles: countFiles,
    folderMetadata: folderMetadata,
    folderClosureMetadata: folderClosureMetadata,
    allowedFields: allowedFields,
    allowedClosureFields: allowedClosureFields
  });
});

router.get('/file-summary/:path', function (req, res) {
  const pathParts = req.params.path.split("/");
  const fileId = pathParts.slice(-1);
  const parentFolder = getFiles(allFiles, pathParts.slice(0, -1));
  const fileDetails = parentFolder.files[fileId];
  const breadcrumbs = getFileBreadcrumbs([], allFiles, pathParts);

  const fileMetadata = (req.session.data.fileMetadata || {})[fileId] || {};

  res.render('file-summary', {
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    fileDetails: fileDetails,
    fileMetadata: fileMetadata,
    allowedFields: allowedFields,
    allowedClosureFields: allowedClosureFields
  });
});

router.get('/add-field-to-folder/:path', function (req, res) {
  const pathParts = req.params.path.split("/");
  const files = getFiles(allFiles, pathParts);
  const breadcrumbs = getBreadcrumbs([], allFiles, pathParts);

  res.render('add-field-to-folder', {
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    contents: files,
    countFiles: countFiles,
    allowedFields: allowedFields
  });
});

router.get('/add-closure-field-to-folder/:path', function (req, res) {
  const pathParts = req.params.path.split("/");
  const files = getFiles(allFiles, pathParts);
  const breadcrumbs = getBreadcrumbs([], allFiles, pathParts);

  res.render('add-closure-field-to-folder', {
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    contents: files,
    countFiles: countFiles,
    allowedClosureFields: allowedClosureFields
  });
});

router.get('/add-field-to-file/:path', function (req, res) {
  const pathParts = req.params.path.split("/");
  const fileId = pathParts.slice(-1);
  const breadcrumbs = getFileBreadcrumbs([], allFiles, pathParts);
  const parentFolder = getFiles(allFiles, pathParts.slice(0, -1));
  const fileDetails = parentFolder.files[fileId];

  res.render('add-field-to-file', {
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    fileDetails: fileDetails,
    allowedFields: allowedFields
  });
});

router.get('/add-closure-field-to-file/:path', function (req, res) {
  const pathParts = req.params.path.split("/");
  const fileId = pathParts.slice(-1);
  const breadcrumbs = getFileBreadcrumbs([], allFiles, pathParts);
  const parentFolder = getFiles(allFiles, pathParts.slice(0, -1));
  const fileDetails = parentFolder.files[fileId];

  res.render('add-closure-field-to-file', {
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    fileDetails: fileDetails,
    allowedClosureFields: allowedClosureFields
  });
});

router.post('/add-field-to-folder/:path', function (req, res) {
  const fieldToAdd = req.session.data["choose-field"];
  const escapedPath = req.params.path.split("/").join("%2F");

  res.redirect(`/set-folder-field-value/${escapedPath}/${fieldToAdd}`);
});

router.post('/add-closure-field-to-folder/:path', function (req, res) {
  const closureFieldToAdd = req.session.data["choose-closure-field"];
  const escapedPath = req.params.path.split("/").join("%2F");

  res.redirect(`/set-folder-closure-field-value/${escapedPath}/${closureFieldToAdd}`);
});

router.post('/add-field-to-file/:path', function (req, res) {
  const fieldToAdd = req.session.data["choose-field"];
  const escapedPath = req.params.path.split("/").join("%2F");

  res.redirect(`/set-file-field-value/${escapedPath}/${fieldToAdd}`);
});

router.post('/add-closure-field-to-file/:path', function (req, res) {
  const fieldToAdd = req.session.data["choose-closure-field"];
  const escapedPath = req.params.path.split("/").join("%2F");

  res.redirect(`/set-file-closure-field-value/${escapedPath}/${fieldToAdd}`);
});

router.get('/set-folder-field-value/:path/:fieldId', function (req, res) {
  const pathParts = req.params.path.split("/");
  const files = getFiles(allFiles, pathParts);
  const breadcrumbs = getBreadcrumbs([], allFiles, pathParts);

  res.render('set-folder-field-value', {
    fieldId: req.params.fieldId,
    field: allowedFields[req.params.fieldId],
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    contents: files,
    countFiles: countFiles,
    allowedFields: allowedFields
  });
});

router.get('/set-folder-closure-field-value/:path/:closureFieldId', function (req, res) {
  const pathParts = req.params.path.split("/");
  const files = getFiles(allFiles, pathParts);
  const breadcrumbs = getBreadcrumbs([], allFiles, pathParts);

  res.render('set-folder-closure-field-value', {
    closureFieldId: req.params.closureFieldId,
    closureField: allowedClosureFields[req.params.closureFieldId],
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    contents: files,
    countFiles: countFiles,
    allowedClosureFields: allowedClosureFields
  });
});

router.post('/set-folder-field-value/:path/:fieldId', function (req, res) {
  const pathParts = req.params.path.split("/");
  const folder = getFiles(allFiles, pathParts);
  const fileIds = getFilesInFolder(folder);

  const fieldId = req.params.fieldId;

  req.session.data.fileMetadata = req.session.data.fileMetadata || {};

  fileIds.forEach(fileId => {
    req.session.data.fileMetadata[fileId] = req.session.data.fileMetadata[fileId] || {};

    if (fieldId == "summary") {
      const textValue = req.session.data["field-value"];
      req.session.data.fileMetadata[fileId][fieldId] = textValue;
    } else if (fieldId == "creatingBody") {
      const inputValue = req.session.data["field-input"];
      req.session.data.fileMetadata[fileId][fieldId] = inputValue;
    } else if (fieldId == "dateCreated") {
      const dateDayValue = req.session.data["date-day"];
      const dateMonthValue = req.session.data["date-month"];
      const dateYearValue = req.session.data["date-year"];
      req.session.data.fileMetadata[fileId][fieldId] = dateDayValue + "/" + dateMonthValue + "/" + dateYearValue;
    } else if (fieldId == "dateRange") {
      const dateDayValue1 = req.session.data["date-day-1"];
      const dateMonthValue1 = req.session.data["date-month-1"];
      const dateYearValue1 = req.session.data["date-year-1"];

      const dateDayValue2 = req.session.data["date-day-2"];
      const dateMonthValue2 = req.session.data["date-month-2"];
      const dateYearValue2 = req.session.data["date-year-2"];
      const from = "From: " + dateDayValue1 + "/" + dateMonthValue1 + "/" + dateYearValue1;
      const to = "To: " + dateDayValue2 + "/" + dateMonthValue2 + "/" + dateYearValue2;
      req.session.data.fileMetadata[fileId][fieldId] = from + " - " + to;
    }
  });

  req.session.data = { fileMetadata: req.session.data.fileMetadata } // Because the only thing to persist in the state is the file metadata information

  const escapedPath = req.params.path.split("/").join("%2F");
  res.redirect(`/edit-folder/${escapedPath}`);
});

router.post('/set-folder-closure-field-value/:path/:closureFieldId', function (req, res) {
  const pathParts = req.params.path.split("/");
  const folder = getFiles(allFiles, pathParts);
  const fileIds = getFilesInFolder(folder);

  const closureFieldId = req.params.closureFieldId;

  req.session.data.fileMetadata = req.session.data.fileMetadata || {};

  fileIds.forEach(fileId => {
    req.session.data.fileMetadata[fileId] = req.session.data.fileMetadata[fileId] || {};

    if (closureFieldId == "descriptionPublic") {
      const textValue = req.session.data["description-value"];
      req.session.data.fileMetadata[fileId][closureFieldId] = textValue;
    } else if (closureFieldId == "FOIexemptionCode") {
      const inputValue = req.session.data["input-field"];
      req.session.data.fileMetadata[fileId][closureFieldId] = inputValue;
    } else if (closureFieldId == "closureStartDate") {
      const dateDayValue = req.session.data["date-day"];
      const dateMonthValue = req.session.data["date-month"];
      const dateYearValue = req.session.data["date-year"];
      req.session.data.fileMetadata[fileId][closureFieldId] = dateDayValue + "/" + dateMonthValue + "/" + dateYearValue;
    } else if (closureFieldId == "closurePeriod") {
      const dateDayValue1 = req.session.data["date-day-1"];
      const dateMonthValue1 = req.session.data["date-month-1"];
      const dateYearValue1 = req.session.data["date-year-1"];

      const dateDayValue2 = req.session.data["date-day-2"];
      const dateMonthValue2 = req.session.data["date-month-2"];
      const dateYearValue2 = req.session.data["date-year-2"];
      const from = "From: " + dateDayValue1 + "/" + dateMonthValue1 + "/" + dateYearValue1;
      const to = "To: " + dateDayValue2 + "/" + dateMonthValue2 + "/" + dateYearValue2;
      req.session.data.fileMetadata[fileId][closureFieldId] = from + " - " + to;
    } else if (closureFieldId == "closureType") {
      const inputValue = req.session.data["input-field"];
      req.session.data.fileMetadata[fileId][closureFieldId] = inputValue;
    }
  });

  req.session.data = { fileMetadata: req.session.data.fileMetadata } // Because the only thing to persist in the state is the file metadata information

  const escapedPath = req.params.path.split("/").join("%2F");
  res.redirect(`/edit-folder/${escapedPath}`);
});

router.get('/set-file-field-value/:path/:fieldId', function (req, res) {
  const pathParts = req.params.path.split("/");
  const fileId = pathParts.slice(-1);
  const breadcrumbs = getFileBreadcrumbs([], allFiles, pathParts);

  res.render('set-file-field-value', {
    fieldId: req.params.fieldId,
    field: allowedFields[req.params.fieldId],
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    allowedFields: allowedFields
  });
});

router.get('/set-file-closure-field-value/:path/:closureFieldId', function (req, res) {
  const pathParts = req.params.path.split("/");
  const fileId = pathParts.slice(-1);
  const breadcrumbs = getFileBreadcrumbs([], allFiles, pathParts);

  res.render('set-file-closure-field-value', {
    closureFieldId: req.params.closureFieldId,
    closureField: allowedClosureFields[req.params.closureFieldId],
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    allowedClosureFields: allowedClosureFields
  });
});

router.post('/set-file-field-value/:path/:fieldId', function (req, res) {
  const pathParts = req.params.path.split("/");
  const fileId = pathParts.slice(-1);

  const fieldId = req.params.fieldId;

  req.session.data.fileMetadata = req.session.data.fileMetadata || {};
  req.session.data.fileMetadata[fileId] = req.session.data.fileMetadata[fileId] || {};

  if (fieldId == "summary") {
    const textValue = req.session.data["field-value"];
    req.session.data.fileMetadata[fileId][fieldId] = textValue;
  } else if (fieldId == "creatingBody") {
    const inputValue = req.session.data["field-input"];
    req.session.data.fileMetadata[fileId][fieldId] = inputValue;
  } else if (fieldId == "dateCreated") {
    const dateDayValue = req.session.data["date-day"];
    const dateMonthValue = req.session.data["date-month"];
    const dateYearValue = req.session.data["date-year"];
    req.session.data.fileMetadata[fileId][fieldId] = dateDayValue + "/" + dateMonthValue + "/" + dateYearValue;
  } else if (fieldId == "dateRange") {
    const dateDayValue1 = req.session.data["date-day-1"];
    const dateMonthValue1 = req.session.data["date-month-1"];
    const dateYearValue1 = req.session.data["date-year-1"];

    const dateDayValue2 = req.session.data["date-day-2"];
    const dateMonthValue2 = req.session.data["date-month-2"];
    const dateYearValue2 = req.session.data["date-year-2"];
    const from = "From: " + dateDayValue1 + "/" + dateMonthValue1 + "/" + dateYearValue1;
    const to = "To: " + dateDayValue2 + "/" + dateMonthValue2 + "/" + dateYearValue2;
    req.session.data.fileMetadata[fileId][fieldId] = from + " - " + to;
  }

  req.session.data = { fileMetadata: req.session.data.fileMetadata } // Because the only thing to persist in the state is the file metadata information

  const escapedPath = req.params.path.split("/").join("%2F");
  res.redirect(`/file-summary/${escapedPath}`);
});

router.post('/set-file-closure-field-value/:path/:closureFieldId', function (req, res) {
  const pathParts = req.params.path.split("/");
  const fileId = pathParts.slice(-1);

  const closureFieldId = req.params.closureFieldId;

  req.session.data.fileMetadata = req.session.data.fileMetadata || {};
  req.session.data.fileMetadata[fileId] = req.session.data.fileMetadata[fileId] || {};

    if (closureFieldId == "descriptionPublic") {
      const textValue = req.session.data["description-value"];
      req.session.data.fileMetadata[fileId][closureFieldId] = textValue;
    } else if (closureFieldId == "FOIexemptionCode") {
      const inputValue = req.session.data["input-field"];
      req.session.data.fileMetadata[fileId][closureFieldId] = inputValue;
    } else if (closureFieldId == "closureStartDate") {
      const dateDayValue = req.session.data["date-day"];
      const dateMonthValue = req.session.data["date-month"];
      const dateYearValue = req.session.data["date-year"];
      req.session.data.fileMetadata[fileId][closureFieldId] = dateDayValue + "/" + dateMonthValue + "/" + dateYearValue;
    } else if (closureFieldId == "closurePeriod") {
      const dateDayValue1 = req.session.data["date-day-1"];
      const dateMonthValue1 = req.session.data["date-month-1"];
      const dateYearValue1 = req.session.data["date-year-1"];

      const dateDayValue2 = req.session.data["date-day-2"];
      const dateMonthValue2 = req.session.data["date-month-2"];
      const dateYearValue2 = req.session.data["date-year-2"];
      const from = "From: " + dateDayValue1 + "/" + dateMonthValue1 + "/" + dateYearValue1;
      const to = "To: " + dateDayValue2 + "/" + dateMonthValue2 + "/" + dateYearValue2;
      req.session.data.fileMetadata[fileId][closureFieldId] = from + " - " + to;
    } else if (closureFieldId == "closureType") {
      const inputValue = req.session.data["input-field"];
      req.session.data.fileMetadata[fileId][closureFieldId] = inputValue;
    }

  req.session.data = { fileMetadata: req.session.data.fileMetadata } // Because the only thing to persist in the state is the file metadata information

  const escapedPath = req.params.path.split("/").join("%2F");
  res.redirect(`/file-summary/${escapedPath}`);
});

module.exports = router
