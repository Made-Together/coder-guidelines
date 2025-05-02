import { config, collection, singleton, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "local"
  },
  ui: {
    navigation: {
      Content: ["chapters", "global"],
    },
  },
  collections: {
    chapters: collection({
      label: "Chapters",
      path: "content/chapters/*",
      slugField: "slug",
      format: { data: "yaml" },
      schema: {
        heading: fields.text({ label: "Heading" }),
        order: fields.number({
          label: "Order",
          description: "The order in which this chapter should appear (lower numbers appear first)",
          validation: { isRequired: false }
        }),
        slug: fields.slug({
          name: {
            label: "URL Slug",
            description: "The URL-friendly identifier for this chapter"
          }
        }),
        downloadFile: fields.file({
          label: "Download File",
          directory: "public/downloads",
          publicPath: "/downloads",
          validation: { isRequired: false }
        }),
        downloadText: fields.text({
          label: "Download Button Text",
          description: "Text to display on the download button (e.g., 'Download Assets' or 'Get Files')",
          validation: { isRequired: false }
        }),
        sections: fields.array(
          fields.object({
            spacing: fields.select({
              label: "Spacing",
              options: [
                { label: "Default", value: "default" },
                { label: "Small", value: "small" }
              ],
              defaultValue: "default"
            }),
            content: fields.blocks({
              intro: {
                label: "Intro",
                schema: fields.object({
                  heading: fields.text({ label: "Heading", validation: { isRequired: false } }),
                  content: fields.text({
                    label: "Content",
                    multiline: true,
                    validation: { isRequired: false }
                  }),
                  downloadFile: fields.file({
                    label: "Download File",
                    directory: "public/downloads",
                    publicPath: "/downloads",
                    validation: { isRequired: false }
                  }),
                  downloadText: fields.text({
                    label: "Download Button Text",
                    description: "Text to display on the download button (e.g., 'Download Assets' or 'Get Files')",
                    validation: { isRequired: false }
                  })
                })
              },
              pitch: {
                label: "Pitch",
                schema: fields.object({
                  content: fields.text({
                    label: "Content",
                    multiline: true,
                    validation: { isRequired: false }
                  })
                })
              },
              fullWidthImage: {
                label: "Full Width Image",
                schema: fields.object({
                  image: fields.image({
                    label: "Image",
                    directory: "public/images",
                    publicPath: "/images",
                    validation: { isRequired: false }
                  }),
                  file: fields.file({
                    label: "File (Download Link - Optional)",
                    publicPath: "/",
                    validation: { isRequired: false }
                  })
                })
              },
              values: {
                label: "Values",
                schema: fields.object({
                  values: fields.array(
                    fields.object({
                      heading: fields.text({ label: "Heading" }),
                      content: fields.text({
                        label: "Content",
                        multiline: true
                      })
                    }),
                    { itemLabel: (props) => props.fields.heading.value }
                  )
                })
              },
              colours: {
                label: "Colours",
                schema: fields.object({
                  colourGroup: fields.select({
                    label: "Colour Group",
                    options: [
                      { label: "Primaries", value: "primaries" },
                      { label: "Secondaries", value: "secondaries" },
                      { label: "Tertiaries", value: "tertiaries" },
                      { label: "Accents", value: "accents" }
                    ],
                    defaultValue: "primaries"
                  })
                })
              },
              fontDisplay: {
                label: "Font Display",
                schema: fields.object({
                  type: fields.select({
                    label: "Font Type",
                    options: [
                      { label: "Headings", value: "headings" },
                      { label: "Body", value: "body" },
                      { label: "Google", value: "google" },
                      { label: "Google 2", value: "google2" }
                    ],
                    defaultValue: "headings"
                  }),
                  backgroundColour: fields.text({
                    label: "Background Colour Class",
                    description: "Tailwind class for background color (e.g. bg-core)"
                  }),
                  textColour: fields.text({
                    label: "Text Colour Class",
                    description: "Tailwind class for text color (e.g. text-white)"
                  })
                })
              },
              twoColImages: {
                label: "Two Column Images",
                schema: fields.object({
                  images: fields.array(
                    fields.object({
                      title: fields.text({ label: "Title", validation: { isRequired: false } }),
                      content: fields.text({ label: "Content", validation: { isRequired: false } }),
                      image: fields.image({
                        label: "Image",
                        directory: "public/images",
                        publicPath: "/images",
                        validation: { isRequired: false }
                      }),
                      file: fields.file({
                        label: "File (Download Link - Optional)",
                        publicPath: "/",
                        validation: { isRequired: false }
                      })
                    }),
                    { itemLabel: (props) => props.fields.title.value || "Image" }
                  )
                })
              },
              threeColImages: {
                label: "Three Column Images",
                schema: fields.object({
                  images: fields.array(
                    fields.object({
                      title: fields.text({ label: "Title", validation: { isRequired: false } }),
                      content: fields.text({ label: "Content", validation: { isRequired: false } }),
                      image: fields.image({
                        label: "Image",
                        directory: "public/images",
                        publicPath: "/images",
                        validation: { isRequired: false }
                      }),
                      file: fields.file({
                        label: "File (Download Link - Optional)",
                        publicPath: "/",
                        validation: { isRequired: false }
                      })
                    }),
                    { itemLabel: (props) => props.fields.title.value || "Image" }
                  )
                })
              },
              twoBoxText: {
                label: "Two Box Text",
                schema: fields.object({
                  block_1_title: fields.text({ label: "Block 1 Title" }),
                  block_1: fields.array(
                    fields.object({
                      title: fields.text({ label: "Title" })
                    }),
                    { itemLabel: (props) => props.fields.title.value }
                  ),
                  block_2_title: fields.text({ label: "Block 2 Title" }),
                  block_2: fields.array(
                    fields.object({
                      title: fields.text({ label: "Title" })
                    }),
                    { itemLabel: (props) => props.fields.title.value }
                  )
                })
              },
              textBox: {
                label: "Text Box",
                schema: fields.object({
                  blocks: fields.array(
                    fields.object({
                      title: fields.text({ label: "Title" })
                    }),
                    { itemLabel: (props) => props.fields.title.value }
                  )
                })
              },
              textBoxContent: {
                label: "Text Box with Content",
                schema: fields.object({
                  blocks: fields.array(
                    fields.object({
                      title: fields.text({ label: "Title" }),
                      content: fields.text({ label: "Content", multiline: true })
                    }),
                    { itemLabel: (props) => props.fields.title.value }
                  )
                })
              },
              doDont: {
                label: "Do & Don't",
                schema: fields.object({
                  right: fields.array(
                    fields.object({
                      heading: fields.text({ label: "Heading" }),
                      content: fields.text({ label: "Content", multiline: true })
                    }),
                    { itemLabel: (props) => props.fields.heading.value }
                  ),
                  wrong: fields.array(
                    fields.object({
                      heading: fields.text({ label: "Heading" }),
                      content: fields.text({ label: "Content", multiline: true })
                    }),
                    { itemLabel: (props) => props.fields.heading.value }
                  )
                })
              },
              iconSet: {
                label: "Icon Set",
                schema: fields.object({
                  icons: fields.array(
                    fields.object({
                      title: fields.text({ label: "Title", validation: { isRequired: false } }),
                      image: fields.image({
                        label: "Image",
                        directory: "public/images",
                        publicPath: "/images",
                        validation: { isRequired: false }
                      }),
                      isDownloadable: fields.checkbox({
                        label: "Make image downloadable",
                        defaultValue: false
                      })
                    }),
                    { itemLabel: (props) => props.fields.title.value || "Icon" }
                  )
                })
              }
            }, { label: "Content Type" })
          })
        )
      }
    }),
  },
  singletons: {
    global: singleton({
      label: "Global Settings",
      path: "content/global",
      format: { data: "yaml" },
      schema: {
        logo: fields.image({
          label: "Logo",
          directory: "public/images",
          publicPath: "/images"
        }),
        favicon: fields.image({
          label: "Favicon",
          directory: "public/favicon",
          publicPath: "/",
          description: "Upload a 32x32 PNG favicon"
        }),
        assetsZip: fields.file({
          label: "Downloadable Assets ZIP",
          publicPath: "/"
        }),
        masthead: fields.object({
          heading: fields.text({ label: "Masthead" }),
          image: fields.image({
            label: "Image",
            directory: "public",
            publicPath: "/"
          }),
          alt: fields.text({ label: "Alt Text" })
        }),
        footer: fields.object({
          heading: fields.text({ label: "Footer" }),
          image: fields.image({
            label: "Image",
            directory: "public",
            publicPath: "/"
          }),
          alt: fields.text({ label: "Alt Text" })
        }),
        seo: fields.object({
          title: fields.text({ label: "Title" }),
          description: fields.text({ label: "Description", multiline: true }),
          url: fields.text({ label: "URL" }),
          image: fields.image({
            label: "SEO Image",
            directory: "public",
            publicPath: "/"
          })
        })
      }
    })
  }
});