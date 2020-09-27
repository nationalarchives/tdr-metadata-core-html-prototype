const express = require('express')
const router = express.Router()

const allFiles = {
  folders: {
    "wildlife-reports": {
      name: "Wildlife reports",
      folders: {
        "goose-reports": {
          name: "Goose reports",
          folders: {
            "goose-annual": {
              name: "Annual reports",
              folders: {
                "goose-annual-supplements": {
                  name: "Supplementary information",
                  folders: {},
                  files: {
                    "goose-annual-supplement-1": {
                      name: "Appendix 1.txt",
                      icon: "🧾"
                    },
                    "goose-annual-supplement-2": {
                      name: "Appendix 2.txt",
                      icon: "🧾"
                    }
                  }
                }
              },
              files: {
                "goose-2005": {
                  name: "Geese 2005.docx",
                  icon: "🧾"
                },
                "goose-2006": {
                  name: "Geese 2006.docx",
                  icon: "🧾"
                },
                "goose-2007": {
                  name: "Geese 2007.docx",
                  icon: "🧾"
                },
                "goose-2008": {
                  name: "Geese 2008.docx",
                  icon: "🧾"
                },
                "goose-2009": {
                  name: "Geese 2009.docx",
                  icon: "🧾"
                },
                "goose-2010": {
                  name: "Geese 2010.docx",
                  icon: "🧾"
                },
              }
            }
          },
          files: {
            "goose-photo": {
              name: "Goose photo.png",
              icon: "🖼️"
            }
          }
        },
        "heron-reports": {
          name: "Heron reports",
          folders: {},
          files: {
            "heron-photo": {
              name: "Heron photo.png",
              icon: "🖼️"
            },
            "heron-with-fish": {
              name: "Heron with fish.jpg",
              icon: "🖼️"
            }
          }
        }
      },
      files: {
        "annual-report": {
          name: "Annual report.docx",
          icon: "🧾"
        },
        "stats": {
          name: "Statistics.xlsx",
          icon: "📊"
        },
        "wildlife-photo": {
          name: "Wildlife photo.jpg",
          icon: "🖼️"
        },
      }
    }
  }
}

const allowedFields = {
  dateCreated: { name: "Date created" },
  geolocation: { name: "Geolocation" },
  language: { name: "Language" },
  originalDepartment: { name: "Original department" },
  summary: { name: "Summary" }
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

// Add your routes here - above the module.exports line

router.get("/", function(req, res) {
  const parentFolder = allFiles.folders[Object.keys(allFiles.folders)[0]]
  const totalFiles = countFiles(parentFolder);
  const parentFolderName = parentFolder.name;

  res.render("index", {
    totalFiles: totalFiles,
    parentFolderName: parentFolderName
  });
});

router.get('/browse/:path', function(req, res) {
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

router.get('/edit-folder/:path', function(req, res) {
  const pathParts = req.params.path.split("/");
  const files = getFiles(allFiles, pathParts);
  const breadcrumbs = getBreadcrumbs([], allFiles, pathParts);

  const fileIds = getFilesInFolder(files);
  const folderMetadata = getFolderMetadata(fileIds, req.session.data.fileMetadata || {});

  res.render('edit-folder', {
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    contents : files,
    countFiles: countFiles,
    folderMetadata: folderMetadata,
    allowedFields: allowedFields
  });
});

router.get('/file-summary/:path', function(req, res) {
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
    allowedFields: allowedFields
  });
});

router.get('/add-field-to-folder/:path', function(req, res) {
  const pathParts = req.params.path.split("/");
  const files = getFiles(allFiles, pathParts);
  const breadcrumbs = getBreadcrumbs([], allFiles, pathParts);

  res.render('add-field-to-folder', {
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    contents : files,
    countFiles: countFiles,
    allowedFields: allowedFields
  });
});

router.get('/add-field-to-file/:path', function(req, res) {
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

router.post('/add-field-to-folder/:path', function(req, res) {
  const fieldToAdd = req.session.data["choose-field"];
  const escapedPath = req.params.path.split("/").join("%2F");

  res.redirect(`/set-folder-field-value/${escapedPath}/${fieldToAdd}`);
});

router.post('/add-field-to-file/:path', function(req, res) {
  const fieldToAdd = req.session.data["choose-field"];
  const escapedPath = req.params.path.split("/").join("%2F");

  res.redirect(`/set-file-field-value/${escapedPath}/${fieldToAdd}`);
});

router.get('/set-folder-field-value/:path/:fieldId', function(req, res) {
  const pathParts = req.params.path.split("/");
  const files = getFiles(allFiles, pathParts);
  const breadcrumbs = getBreadcrumbs([], allFiles, pathParts);

  res.render('set-folder-field-value', {
    fieldId: req.params.fieldId,
    field: allowedFields[req.params.fieldId],
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    contents : files,
    countFiles: countFiles,
    allowedFields: allowedFields
  });
});

router.post('/set-folder-field-value/:path/:fieldId', function(req, res) {
  const pathParts = req.params.path.split("/");
  const folder = getFiles(allFiles, pathParts);
  const fileIds = getFilesInFolder(folder);

  const fieldId = req.params.fieldId;
  const value = req.session.data["field-value"];

  req.session.data.fileMetadata = req.session.data.fileMetadata || {};
  fileIds.forEach(fileId => {
    req.session.data.fileMetadata[fileId] = req.session.data.fileMetadata[fileId] || {};
    req.session.data.fileMetadata[fileId][fieldId] = value;
  });

  const escapedPath = req.params.path.split("/").join("%2F");
  res.redirect(`/edit-folder/${escapedPath}`);
});

router.get('/set-file-field-value/:path/:fieldId', function(req, res) {
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

router.post('/set-file-field-value/:path/:fieldId', function(req, res) {
  const pathParts = req.params.path.split("/");
  const fileId = pathParts.slice(-1);

  const fieldId = req.params.fieldId;
  const value = req.session.data["field-value"];

  req.session.data.fileMetadata = req.session.data.fileMetadata || {};
  req.session.data.fileMetadata[fileId] = req.session.data.fileMetadata[fileId] || {};
  req.session.data.fileMetadata[fileId][fieldId] = value;

  const escapedPath = req.params.path.split("/").join("%2F");
  res.redirect(`/file-summary/${escapedPath}`);
});

module.exports = router
