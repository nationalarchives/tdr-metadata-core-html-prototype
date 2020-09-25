const express = require('express')
const router = express.Router()

const files = {
  id: "wildlife-reports",
  name: "Wildlife reports",
  folders: [
    {
      id: "goose-reports",
      name: "Goose reports",
      folders: [
        {
          id: "goose-annual",
          name: "Annual reports",
          folders: [
            {
              id: "goose-annual-supplements",
              name: "Supplementary information",
              files: [
                {
                  id: "goose-annual-supplement-1",
                  name: "Appendix 1.txt",
                  icon: "🧾"
                },
                {
                  id: "goose-annual-supplement-2",
                  name: "Appendix 2.txt",
                  icon: "🧾"
                }
              ]
            }
          ],
          files: [
            {
              id: "goose-2005",
              name: "Geese 2005.docx",
              icon: "🧾"
            },
            {
              id: "goose-2006",
              name: "Geese 2006.docx",
              icon: "🧾"
            },
            {
              id: "goose-2007",
              name: "Geese 2007.docx",
              icon: "🧾"
            },
            {
              id: "goose-2008",
              name: "Geese 2008.docx",
              icon: "🧾"
            },
            {
              id: "goose-2009",
              name: "Geese 2009.docx",
              icon: "🧾"
            },
            {
              id: "goose-2010",
              name: "Geese 2010.docx",
              icon: "🧾"
            },
          ]
        }
      ],
      files: [
        {
          id: "goose-photo",
          name: "Goose photo.png",
          icon: "🖼️"
        }
      ]
    },
    {
      id: "heron-reports",
      name: "Heron reports",
      files: [
        {
          id: "heron-photo",
          name: "Heron photo.png",
          icon: "🖼️"
        },
        {
          id: "heron-with-fish",
          name: "Heron with fish.jpg",
          icon: "🖼️"
        }
      ]
    }
  ],
  files: [
    {
      id: "annual-report",
      name: "Annual report.docx",
      icon: "🧾"
    },
    {
      id: "stats",
      name: "Statistics.xlsx",
      icon: "📊"
    },
    {
      id: "wildlife-photo",
      name: "Wildlife photo.jpg",
      icon: "🖼️"
    },
  ]
}

// Add your routes here - above the module.exports line

router.get('/browse/:path', function(req, res) {
  console.log(`Visiting ${req.params.path}`)

  res.render('browse', { contents : files });
});

module.exports = router
