import { type ModalConfig } from "../hooks/useModal";
export const MODAL_CONFIGS: ModalConfig[] = [
  {
    modalId: "submit-tool",
    modalTitle: "TOOL",
    submitURL: "/api/submit",
    pages: [
      {
        title: "Basic Info",
        fields: [
          {
            type: "text",
            name: "name",
            label: "NAME",
            placeholder: "e.g. Excalidraw",
            required: true,
          },
          {
            type: "textarea",
            name: "description",
            label: "DESCRIPTION",
            placeholder: "One sentence. What does it do?",
            required: true,
          },
          {
            type: "text",
            name: "url",
            label: "URL",
            placeholder: "https://excalidraw.com",
            required: true,
          },
          {
            type: "text",
            name: "tags",
            label: "TAGS",
            placeholder: "drawing, whiteboard, collaboration",
          },
          {
            type: "text",
            name: "github",
            label: "GITHUB",
            placeholder: "https://github.com/excalidraw/excalidraw",
          },
          {
            type: "select",
            name: "category",
            label: "CATEGORY",
            options: {
              invalid: "--Select one --",
              productivity: "Productivity",
              design: "Design & Graphics",
              development: "Development",
              writing: "Writing & Docs",
              privacy: "Privacy",
              utilities: "Utilities",
              data: "Data & Analytics",
              media: "Media",
            },
            required: true,
          },
        ],
      },
    ],
  },
  {
    modalId: "report-tool",
    modalTitle: "REPORT",
    submitURL: "/api/submit",
    pages: [
      {
        title: "Basic Info",
        fields: [
          {
            type: "text",
            name: "tool-id",
            label: "TOOL ID",
            placeholder: "e.g. excalidraw",
            required: true,
          },
          {
            type: "textarea",
            name: "report",
            label: "REPORT",
            placeholder: "What would you like to report about the tool?",
            required: true,
          },
        ],
      },
    ],
  },
  {
    modalId: "suggest-tool",
    modalTitle: "SUGGESTION",
    submitURL: "#",
    pages: [
      {
        title: "Basic Info",
        fields: [
          {
            label: "Your tool idea:",
            name: "tool-idea",
            required: true,
            type: "textarea",
            placeholder: "I'd like a tool that...",
          },
        ],
      },
    ],
  },
];
