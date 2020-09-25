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

// Add your routes here - above the module.exports line

router.get('/browse/:path', function(req, res) {
  const pathParts = req.params.path.split("/");
  const files = getFiles(allFiles, pathParts)
  const breadcrumbs = getBreadcrumbs([], allFiles, pathParts)

  res.render('browse', {
    currentPath: pathParts,
    breadcrumbs: breadcrumbs,
    contents : files
  });
});

module.exports = router
