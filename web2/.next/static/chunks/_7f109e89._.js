(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([
  typeof document === "object" ? document.currentScript : undefined,
  {
    "[project]/src/components/ui/card.tsx [app-client] (ecmascript)": (
      __turbopack_context__,
    ) => {
      "use strict";

      var {
        g: global,
        __dirname,
        k: __turbopack_refresh__,
        m: module,
      } = __turbopack_context__;
      {
        __turbopack_context__.s({
          Card: () => Card,
          CardAction: () => CardAction,
          CardContent: () => CardContent,
          CardDescription: () => CardDescription,
          CardFooter: () => CardFooter,
          CardHeader: () => CardHeader,
          CardTitle: () => CardTitle,
        });
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/src/lib/utils.ts [app-client] (ecmascript)",
          );
        function Card({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "div",
            {
              "data-slot": "card",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])(
                "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
                className,
              ),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/card.tsx",
              lineNumber: 7,
              columnNumber: 5,
            },
            this,
          );
        }
        _c = Card;
        function CardHeader({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "div",
            {
              "data-slot": "card-header",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])(
                "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
                className,
              ),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/card.tsx",
              lineNumber: 20,
              columnNumber: 5,
            },
            this,
          );
        }
        _c1 = CardHeader;
        function CardTitle({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "div",
            {
              "data-slot": "card-title",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])("leading-none font-semibold", className),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/card.tsx",
              lineNumber: 33,
              columnNumber: 5,
            },
            this,
          );
        }
        _c2 = CardTitle;
        function CardDescription({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "div",
            {
              "data-slot": "card-description",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])("text-muted-foreground text-sm", className),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/card.tsx",
              lineNumber: 43,
              columnNumber: 5,
            },
            this,
          );
        }
        _c3 = CardDescription;
        function CardAction({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "div",
            {
              "data-slot": "card-action",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])(
                "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
                className,
              ),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/card.tsx",
              lineNumber: 53,
              columnNumber: 5,
            },
            this,
          );
        }
        _c4 = CardAction;
        function CardContent({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "div",
            {
              "data-slot": "card-content",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])("px-6", className),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/card.tsx",
              lineNumber: 66,
              columnNumber: 5,
            },
            this,
          );
        }
        _c5 = CardContent;
        function CardFooter({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "div",
            {
              "data-slot": "card-footer",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])("flex items-center px-6 [.border-t]:pt-6", className),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/card.tsx",
              lineNumber: 76,
              columnNumber: 5,
            },
            this,
          );
        }
        _c6 = CardFooter;
        var _c, _c1, _c2, _c3, _c4, _c5, _c6;
        __turbopack_context__.k.register(_c, "Card");
        __turbopack_context__.k.register(_c1, "CardHeader");
        __turbopack_context__.k.register(_c2, "CardTitle");
        __turbopack_context__.k.register(_c3, "CardDescription");
        __turbopack_context__.k.register(_c4, "CardAction");
        __turbopack_context__.k.register(_c5, "CardContent");
        __turbopack_context__.k.register(_c6, "CardFooter");
        if (
          typeof globalThis.$RefreshHelpers$ === "object" &&
          globalThis.$RefreshHelpers !== null
        ) {
          __turbopack_context__.k.registerExports(
            module,
            globalThis.$RefreshHelpers$,
          );
        }
      }
    },
    "[project]/src/components/ui/table.tsx [app-client] (ecmascript)": (
      __turbopack_context__,
    ) => {
      "use strict";

      var {
        g: global,
        __dirname,
        k: __turbopack_refresh__,
        m: module,
      } = __turbopack_context__;
      {
        __turbopack_context__.s({
          Table: () => Table,
          TableBody: () => TableBody,
          TableCaption: () => TableCaption,
          TableCell: () => TableCell,
          TableFooter: () => TableFooter,
          TableHead: () => TableHead,
          TableHeader: () => TableHeader,
          TableRow: () => TableRow,
        });
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/src/lib/utils.ts [app-client] (ecmascript)",
          );
        ("use client");
        function Table({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "div",
            {
              "data-slot": "table-container",
              className: "relative w-full overflow-x-auto",
              children: /*#__PURE__*/ (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "jsxDEV"
              ])(
                "table",
                {
                  "data-slot": "table",
                  className: (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    "cn"
                  ])("w-full caption-bottom text-sm", className),
                  ...props,
                },
                void 0,
                false,
                {
                  fileName: "[project]/src/components/ui/table.tsx",
                  lineNumber: 13,
                  columnNumber: 7,
                },
                this,
              ),
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/table.tsx",
              lineNumber: 9,
              columnNumber: 5,
            },
            this,
          );
        }
        _c = Table;
        function TableHeader({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "thead",
            {
              "data-slot": "table-header",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])("[&_tr]:border-b", className),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/table.tsx",
              lineNumber: 24,
              columnNumber: 5,
            },
            this,
          );
        }
        _c1 = TableHeader;
        function TableBody({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "tbody",
            {
              "data-slot": "table-body",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])("[&_tr:last-child]:border-0", className),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/table.tsx",
              lineNumber: 34,
              columnNumber: 5,
            },
            this,
          );
        }
        _c2 = TableBody;
        function TableFooter({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "tfoot",
            {
              "data-slot": "table-footer",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])(
                "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
                className,
              ),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/table.tsx",
              lineNumber: 44,
              columnNumber: 5,
            },
            this,
          );
        }
        _c3 = TableFooter;
        function TableRow({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "tr",
            {
              "data-slot": "table-row",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])(
                "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
                className,
              ),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/table.tsx",
              lineNumber: 57,
              columnNumber: 5,
            },
            this,
          );
        }
        _c4 = TableRow;
        function TableHead({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "th",
            {
              "data-slot": "table-head",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])(
                "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className,
              ),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/table.tsx",
              lineNumber: 70,
              columnNumber: 5,
            },
            this,
          );
        }
        _c5 = TableHead;
        function TableCell({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "td",
            {
              "data-slot": "table-cell",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])(
                "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className,
              ),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/table.tsx",
              lineNumber: 83,
              columnNumber: 5,
            },
            this,
          );
        }
        _c6 = TableCell;
        function TableCaption({ className, ...props }) {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "caption",
            {
              "data-slot": "table-caption",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])("text-muted-foreground mt-4 text-sm", className),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/table.tsx",
              lineNumber: 99,
              columnNumber: 5,
            },
            this,
          );
        }
        _c7 = TableCaption;
        var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
        __turbopack_context__.k.register(_c, "Table");
        __turbopack_context__.k.register(_c1, "TableHeader");
        __turbopack_context__.k.register(_c2, "TableBody");
        __turbopack_context__.k.register(_c3, "TableFooter");
        __turbopack_context__.k.register(_c4, "TableRow");
        __turbopack_context__.k.register(_c5, "TableHead");
        __turbopack_context__.k.register(_c6, "TableCell");
        __turbopack_context__.k.register(_c7, "TableCaption");
        if (
          typeof globalThis.$RefreshHelpers$ === "object" &&
          globalThis.$RefreshHelpers !== null
        ) {
          __turbopack_context__.k.registerExports(
            module,
            globalThis.$RefreshHelpers$,
          );
        }
      }
    },
    "[project]/src/components/ui/button.tsx [app-client] (ecmascript)": (
      __turbopack_context__,
    ) => {
      "use strict";

      var {
        g: global,
        __dirname,
        k: __turbopack_refresh__,
        m: module,
      } = __turbopack_context__;
      {
        __turbopack_context__.s({
          Button: () => Button,
          buttonVariants: () => buttonVariants,
        });
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/src/lib/utils.ts [app-client] (ecmascript)",
          );
        const buttonVariants = (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          "cva"
        ])(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          {
            variants: {
              variant: {
                default:
                  "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
                destructive:
                  "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                  "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
                secondary:
                  "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                ghost:
                  "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                link: "text-primary underline-offset-4 hover:underline",
              },
              size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
              },
            },
            defaultVariants: {
              variant: "default",
              size: "default",
            },
          },
        );
        function Button({
          className,
          variant,
          size,
          asChild = false,
          ...props
        }) {
          const Comp = asChild
            ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "Slot"
              ]
            : "button";
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            Comp,
            {
              "data-slot": "button",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])(
                buttonVariants({
                  variant,
                  size,
                  className,
                }),
              ),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/button.tsx",
              lineNumber: 51,
              columnNumber: 5,
            },
            this,
          );
        }
        _c = Button;
        var _c;
        __turbopack_context__.k.register(_c, "Button");
        if (
          typeof globalThis.$RefreshHelpers$ === "object" &&
          globalThis.$RefreshHelpers !== null
        ) {
          __turbopack_context__.k.registerExports(
            module,
            globalThis.$RefreshHelpers$,
          );
        }
      }
    },
    "[project]/src/components/ui/badge.tsx [app-client] (ecmascript)": (
      __turbopack_context__,
    ) => {
      "use strict";

      var {
        g: global,
        __dirname,
        k: __turbopack_refresh__,
        m: module,
      } = __turbopack_context__;
      {
        __turbopack_context__.s({
          Badge: () => Badge,
          badgeVariants: () => badgeVariants,
        });
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/src/lib/utils.ts [app-client] (ecmascript)",
          );
        const badgeVariants = (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          "cva"
        ])(
          "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
          {
            variants: {
              variant: {
                default:
                  "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
                secondary:
                  "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
                destructive:
                  "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                  "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
              },
            },
            defaultVariants: {
              variant: "default",
            },
          },
        );
        function Badge({ className, variant, asChild = false, ...props }) {
          const Comp = asChild
            ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "Slot"
              ]
            : "span";
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            Comp,
            {
              "data-slot": "badge",
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "cn"
              ])(
                badgeVariants({
                  variant,
                }),
                className,
              ),
              ...props,
            },
            void 0,
            false,
            {
              fileName: "[project]/src/components/ui/badge.tsx",
              lineNumber: 38,
              columnNumber: 5,
            },
            this,
          );
        }
        _c = Badge;
        var _c;
        __turbopack_context__.k.register(_c, "Badge");
        if (
          typeof globalThis.$RefreshHelpers$ === "object" &&
          globalThis.$RefreshHelpers !== null
        ) {
          __turbopack_context__.k.registerExports(
            module,
            globalThis.$RefreshHelpers$,
          );
        }
      }
    },
    "[project]/src/app/page.tsx [app-client] (ecmascript)": (
      __turbopack_context__,
    ) => {
      "use strict";

      var {
        g: global,
        __dirname,
        k: __turbopack_refresh__,
        m: module,
      } = __turbopack_context__;
      {
        __turbopack_context__.s({
          default: () => Home,
        });
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/src/components/ui/card.tsx [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CameraIcon$3e$__ =
          __turbopack_context__.i(
            "[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-client] (ecmascript) <export default as CameraIcon>",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__ =
          __turbopack_context__.i(
            "[project]/node_modules/lucide-react/dist/esm/icons/file.js [app-client] (ecmascript) <export default as File>",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ =
          __turbopack_context__.i(
            "[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/src/components/ui/table.tsx [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/src/components/ui/button.tsx [app-client] (ecmascript)",
          );
        var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
          __turbopack_context__.i(
            "[project]/src/components/ui/badge.tsx [app-client] (ecmascript)",
          );
        ("use client");
        function Home() {
          return /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "jsxDEV"
          ])(
            "main",
            {
              className: "sm:ml-14 p-4",
              children: [
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  "jsxDEV"
                ])(
                  "section",
                  {
                    className: `grid gap-4 ${
                      // Adjust columns responsively: 1 on mobile, 2 on sm, 3 on md, 5 on lg+
                      "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                    }`,
                    children: [
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        "jsxDEV"
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          "Card"
                        ],
                        {
                          children: /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            "jsxDEV"
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              "CardHeader"
                            ],
                            {
                              children: [
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  "div",
                                  {
                                    className:
                                      "flex items-center justify-center",
                                    children: [
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        "jsxDEV"
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          "CardTitle"
                                        ],
                                        {
                                          className:
                                            "text-lg sm:text-xl text=gray-800 select-none",
                                          children: "Requisições",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "[project]/src/app/page.tsx",
                                          lineNumber: 30,
                                          columnNumber: 11,
                                        },
                                        this,
                                      ),
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        "jsxDEV"
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__[
                                          "File"
                                        ],
                                        {
                                          className: "ml-auto w-4 h-4",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "[project]/src/app/page.tsx",
                                          lineNumber: 33,
                                          columnNumber: 11,
                                        },
                                        this,
                                      ),
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 29,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    "CardDescription"
                                  ],
                                  {
                                    children: "Total de requisições recebidas",
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 35,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    "CardContent"
                                  ],
                                  {
                                    children: /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      "jsxDEV"
                                    ])(
                                      "p",
                                      {
                                        className:
                                          "text-base sm:text-lg font-bold",
                                        children: "4000",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 39,
                                        columnNumber: 11,
                                      },
                                      this,
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 38,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                              ],
                            },
                            void 0,
                            true,
                            {
                              fileName: "[project]/src/app/page.tsx",
                              lineNumber: 28,
                              columnNumber: 11,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "[project]/src/app/page.tsx",
                          lineNumber: 27,
                          columnNumber: 9,
                        },
                        this,
                      ),
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        "jsxDEV"
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          "Card"
                        ],
                        {
                          className: "border-blue-600",
                          children: /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            "jsxDEV"
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              "CardHeader"
                            ],
                            {
                              children: [
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  "div",
                                  {
                                    className:
                                      "flex items-center justify-center",
                                    children: [
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        "jsxDEV"
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          "CardTitle"
                                        ],
                                        {
                                          className:
                                            "text-lg sm:text-xl text=gray-800 select-none",
                                          children: "Em Andamento",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "[project]/src/app/page.tsx",
                                          lineNumber: 49,
                                          columnNumber: 11,
                                        },
                                        this,
                                      ),
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        "jsxDEV"
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__[
                                          "Package"
                                        ],
                                        {
                                          className: "ml-auto w-4 h-4",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "[project]/src/app/page.tsx",
                                          lineNumber: 52,
                                          columnNumber: 11,
                                        },
                                        this,
                                      ),
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 48,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    "CardDescription"
                                  ],
                                  {
                                    children: "Total de requisições recebidas",
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    "CardContent"
                                  ],
                                  {
                                    children: /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      "jsxDEV"
                                    ])(
                                      "p",
                                      {
                                        className:
                                          "text-base sm:text-lg font-bold",
                                        children: "4000",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 58,
                                        columnNumber: 11,
                                      },
                                      this,
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 57,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                              ],
                            },
                            void 0,
                            true,
                            {
                              fileName: "[project]/src/app/page.tsx",
                              lineNumber: 47,
                              columnNumber: 11,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "[project]/src/app/page.tsx",
                          lineNumber: 46,
                          columnNumber: 9,
                        },
                        this,
                      ),
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        "jsxDEV"
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          "Card"
                        ],
                        {
                          className: "border-yellow-400",
                          children: /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            "jsxDEV"
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              "CardHeader"
                            ],
                            {
                              children: [
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  "div",
                                  {
                                    className:
                                      "flex items-center justify-center",
                                    children: [
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        "jsxDEV"
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          "CardTitle"
                                        ],
                                        {
                                          className:
                                            "text-lg sm:text-xl text=gray-800 select-none",
                                          children: "Requisições",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "[project]/src/app/page.tsx",
                                          lineNumber: 68,
                                          columnNumber: 11,
                                        },
                                        this,
                                      ),
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        "jsxDEV"
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__[
                                          "Package"
                                        ],
                                        {
                                          className: "ml-auto w-4 h-4",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "[project]/src/app/page.tsx",
                                          lineNumber: 71,
                                          columnNumber: 11,
                                        },
                                        this,
                                      ),
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 67,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    "CardDescription"
                                  ],
                                  {
                                    children: "Total de requisições recebidas",
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 73,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    "CardContent"
                                  ],
                                  {
                                    children: /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      "jsxDEV"
                                    ])(
                                      "p",
                                      {
                                        className:
                                          "text-base sm:text-lg font-bold",
                                        children: "4000",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 77,
                                        columnNumber: 11,
                                      },
                                      this,
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 76,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                              ],
                            },
                            void 0,
                            true,
                            {
                              fileName: "[project]/src/app/page.tsx",
                              lineNumber: 66,
                              columnNumber: 11,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "[project]/src/app/page.tsx",
                          lineNumber: 65,
                          columnNumber: 9,
                        },
                        this,
                      ),
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        "jsxDEV"
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          "Card"
                        ],
                        {
                          className: "border-red-600",
                          children: /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            "jsxDEV"
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              "CardHeader"
                            ],
                            {
                              children: [
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  "div",
                                  {
                                    className:
                                      "flex items-center justify-center",
                                    children: [
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        "jsxDEV"
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          "CardTitle"
                                        ],
                                        {
                                          className:
                                            "text-lg sm:text-xl text=gray-800 select-none",
                                          children: "Requisições",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "[project]/src/app/page.tsx",
                                          lineNumber: 87,
                                          columnNumber: 11,
                                        },
                                        this,
                                      ),
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        "jsxDEV"
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__[
                                          "Package"
                                        ],
                                        {
                                          className: "ml-auto w-4 h-4",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "[project]/src/app/page.tsx",
                                          lineNumber: 90,
                                          columnNumber: 11,
                                        },
                                        this,
                                      ),
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 86,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    "CardDescription"
                                  ],
                                  {
                                    children: "Total de requisições recebidas",
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 92,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    "CardContent"
                                  ],
                                  {
                                    children: /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      "jsxDEV"
                                    ])(
                                      "p",
                                      {
                                        className:
                                          "text-base sm:text-lg font-bold",
                                        children: "4000",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 96,
                                        columnNumber: 11,
                                      },
                                      this,
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 95,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                              ],
                            },
                            void 0,
                            true,
                            {
                              fileName: "[project]/src/app/page.tsx",
                              lineNumber: 85,
                              columnNumber: 11,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "[project]/src/app/page.tsx",
                          lineNumber: 84,
                          columnNumber: 9,
                        },
                        this,
                      ),
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        "jsxDEV"
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          "Card"
                        ],
                        {
                          className: "border-green-600",
                          children: /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            "jsxDEV"
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              "CardHeader"
                            ],
                            {
                              children: [
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  "div",
                                  {
                                    className:
                                      "flex items-center justify-center",
                                    children: [
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        "jsxDEV"
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          "CardTitle"
                                        ],
                                        {
                                          className:
                                            "text-lg sm:text-xl text=gray-800 select-none",
                                          children: "Requisições",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "[project]/src/app/page.tsx",
                                          lineNumber: 106,
                                          columnNumber: 11,
                                        },
                                        this,
                                      ),
                                      /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        "jsxDEV"
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__[
                                          "Package"
                                        ],
                                        {
                                          className: "ml-auto w-4 h-4",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "[project]/src/app/page.tsx",
                                          lineNumber: 109,
                                          columnNumber: 11,
                                        },
                                        this,
                                      ),
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 105,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    "CardDescription"
                                  ],
                                  {
                                    children: "Total de requisições recebidas",
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 111,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                                /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "jsxDEV"
                                ])(
                                  __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    "CardContent"
                                  ],
                                  {
                                    children: /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      "jsxDEV"
                                    ])(
                                      "p",
                                      {
                                        className:
                                          "text-base sm:text-lg font-bold",
                                        children: "4000",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 115,
                                        columnNumber: 11,
                                      },
                                      this,
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 114,
                                    columnNumber: 9,
                                  },
                                  this,
                                ),
                              ],
                            },
                            void 0,
                            true,
                            {
                              fileName: "[project]/src/app/page.tsx",
                              lineNumber: 104,
                              columnNumber: 11,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "[project]/src/app/page.tsx",
                          lineNumber: 103,
                          columnNumber: 9,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 21,
                    columnNumber: 7,
                  },
                  this,
                ),
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  "jsxDEV"
                ])(
                  "section",
                  {
                    className: "mt-4 flex flex-col",
                    children: /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                      "jsxDEV"
                    ])(
                      __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        "Card"
                      ],
                      {
                        children: /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          "jsxDEV"
                        ])(
                          __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            "CardHeader"
                          ],
                          {
                            children: [
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                "jsxDEV"
                              ])(
                                "div",
                                {
                                  className: "flex items-center justify-center",
                                  children: [
                                    /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      "jsxDEV"
                                    ])(
                                      __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        "CardTitle"
                                      ],
                                      {
                                        className:
                                          "text-lg sm:text-xl text=gray-800 select-none",
                                        children: "Requisições",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13,
                                      },
                                      this,
                                    ),
                                    /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      "jsxDEV"
                                    ])(
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__[
                                        "File"
                                      ],
                                      {
                                        className: "ml-auto w-4 h-4",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 131,
                                        columnNumber: 13,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "[project]/src/app/page.tsx",
                                  lineNumber: 127,
                                  columnNumber: 11,
                                },
                                this,
                              ),
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                "jsxDEV"
                              ])(
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "CardDescription"
                                ],
                                {
                                  children: "Total de requisições recebidas",
                                },
                                void 0,
                                false,
                                {
                                  fileName: "[project]/src/app/page.tsx",
                                  lineNumber: 133,
                                  columnNumber: 11,
                                },
                                this,
                              ),
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                "jsxDEV"
                              ])(
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  "CardContent"
                                ],
                                {
                                  className: "overflow-x-auto p-0",
                                  children: /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    "jsxDEV"
                                  ])(
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      "Table"
                                    ],
                                    {
                                      children: [
                                        /*#__PURE__*/ (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          "jsxDEV"
                                        ])(
                                          __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                            "TableCaption"
                                          ],
                                          {
                                            children:
                                              "A list of your recent invoices.",
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "[project]/src/app/page.tsx",
                                            lineNumber: 138,
                                            columnNumber: 15,
                                          },
                                          this,
                                        ),
                                        /*#__PURE__*/ (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          "jsxDEV"
                                        ])(
                                          __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                            "TableHeader"
                                          ],
                                          {
                                            children: /*#__PURE__*/ (0,
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                              "jsxDEV"
                                            ])(
                                              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                "TableRow"
                                              ],
                                              {
                                                children: [
                                                  /*#__PURE__*/ (0,
                                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                    "jsxDEV"
                                                  ])(
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                      "TableHead"
                                                    ],
                                                    {
                                                      className: "w-[100px]",
                                                      children: "Invoice",
                                                    },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "[project]/src/app/page.tsx",
                                                      lineNumber: 141,
                                                      columnNumber: 19,
                                                    },
                                                    this,
                                                  ),
                                                  /*#__PURE__*/ (0,
                                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                    "jsxDEV"
                                                  ])(
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                      "TableHead"
                                                    ],
                                                    {
                                                      children: "Status",
                                                    },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "[project]/src/app/page.tsx",
                                                      lineNumber: 142,
                                                      columnNumber: 19,
                                                    },
                                                    this,
                                                  ),
                                                  /*#__PURE__*/ (0,
                                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                    "jsxDEV"
                                                  ])(
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                      "TableHead"
                                                    ],
                                                    {
                                                      children: "Method",
                                                    },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "[project]/src/app/page.tsx",
                                                      lineNumber: 143,
                                                      columnNumber: 19,
                                                    },
                                                    this,
                                                  ),
                                                  /*#__PURE__*/ (0,
                                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                    "jsxDEV"
                                                  ])(
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                      "TableHead"
                                                    ],
                                                    {
                                                      children: "Stage",
                                                    },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "[project]/src/app/page.tsx",
                                                      lineNumber: 144,
                                                      columnNumber: 19,
                                                    },
                                                    this,
                                                  ),
                                                  /*#__PURE__*/ (0,
                                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                    "jsxDEV"
                                                  ])(
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                      "TableHead"
                                                    ],
                                                    {
                                                      className: "text-right",
                                                      children: "Amount",
                                                    },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "[project]/src/app/page.tsx",
                                                      lineNumber: 145,
                                                      columnNumber: 19,
                                                    },
                                                    this,
                                                  ),
                                                ],
                                              },
                                              void 0,
                                              true,
                                              {
                                                fileName:
                                                  "[project]/src/app/page.tsx",
                                                lineNumber: 140,
                                                columnNumber: 17,
                                              },
                                              this,
                                            ),
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "[project]/src/app/page.tsx",
                                            lineNumber: 139,
                                            columnNumber: 15,
                                          },
                                          this,
                                        ),
                                        /*#__PURE__*/ (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          "jsxDEV"
                                        ])(
                                          __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                            "TableBody"
                                          ],
                                          {
                                            children: /*#__PURE__*/ (0,
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                              "jsxDEV"
                                            ])(
                                              __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                "TableRow"
                                              ],
                                              {
                                                children: [
                                                  /*#__PURE__*/ (0,
                                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                    "jsxDEV"
                                                  ])(
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                      "TableCell"
                                                    ],
                                                    {
                                                      className: "font-medium",
                                                      children: "INV001",
                                                    },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "[project]/src/app/page.tsx",
                                                      lineNumber: 150,
                                                      columnNumber: 19,
                                                    },
                                                    this,
                                                  ),
                                                  /*#__PURE__*/ (0,
                                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                    "jsxDEV"
                                                  ])(
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                      "TableCell"
                                                    ],
                                                    {
                                                      children: "Paid",
                                                    },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "[project]/src/app/page.tsx",
                                                      lineNumber: 151,
                                                      columnNumber: 19,
                                                    },
                                                    this,
                                                  ),
                                                  /*#__PURE__*/ (0,
                                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                    "jsxDEV"
                                                  ])(
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                      "TableCell"
                                                    ],
                                                    {
                                                      children: "Credit Card",
                                                    },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "[project]/src/app/page.tsx",
                                                      lineNumber: 152,
                                                      columnNumber: 19,
                                                    },
                                                    this,
                                                  ),
                                                  /*#__PURE__*/ (0,
                                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                    "jsxDEV"
                                                  ])(
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                      "TableCell"
                                                    ],
                                                    {
                                                      children:
                                                        /*#__PURE__*/ (0,
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                          "jsxDEV"
                                                        ])(
                                                          __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                            "Badge"
                                                          ],
                                                          {
                                                            variant:
                                                              "secondary",
                                                            className:
                                                              "bg-blue-400",
                                                            children:
                                                              "Em Andamento",
                                                          },
                                                          void 0,
                                                          false,
                                                          {
                                                            fileName:
                                                              "[project]/src/app/page.tsx",
                                                            lineNumber: 154,
                                                            columnNumber: 21,
                                                          },
                                                          this,
                                                        ),
                                                    },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "[project]/src/app/page.tsx",
                                                      lineNumber: 153,
                                                      columnNumber: 19,
                                                    },
                                                    this,
                                                  ),
                                                  /*#__PURE__*/ (0,
                                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                    "jsxDEV"
                                                  ])(
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                      "TableCell"
                                                    ],
                                                    {
                                                      className: "text-right",
                                                      children: "$250.00",
                                                    },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "[project]/src/app/page.tsx",
                                                      lineNumber: 156,
                                                      columnNumber: 19,
                                                    },
                                                    this,
                                                  ),
                                                ],
                                              },
                                              void 0,
                                              true,
                                              {
                                                fileName:
                                                  "[project]/src/app/page.tsx",
                                                lineNumber: 149,
                                                columnNumber: 17,
                                              },
                                              this,
                                            ),
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "[project]/src/app/page.tsx",
                                            lineNumber: 148,
                                            columnNumber: 15,
                                          },
                                          this,
                                        ),
                                      ],
                                    },
                                    void 0,
                                    true,
                                    {
                                      fileName: "[project]/src/app/page.tsx",
                                      lineNumber: 137,
                                      columnNumber: 13,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "[project]/src/app/page.tsx",
                                  lineNumber: 136,
                                  columnNumber: 11,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 126,
                            columnNumber: 11,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 125,
                        columnNumber: 9,
                      },
                      this,
                    ),
                  },
                  void 0,
                  false,
                  {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 123,
                    columnNumber: 7,
                  },
                  this,
                ),
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  "jsxDEV"
                ])(
                  "div",
                  {
                    className: "fixed bottom-4 right-4 z-50",
                    children: /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                      "jsxDEV"
                    ])(
                      __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        "Button"
                      ],
                      {
                        size: "lg",
                        className:
                          "bg-green-700 text-gray-50 hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300 rounded-full",
                        onClick: () => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.capture = "environment";
                          input.onchange = (e) => {
                            // handle file selection here
                            const file = e.target.files?.[0];
                            if (file) {
                              // Do something with the file
                              console.log(file);
                              alert(`Arquivo selecionado: ${file.name}`);
                            }
                          };
                          input.click();
                        },
                        children: [
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            "jsxDEV"
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CameraIcon$3e$__[
                              "CameraIcon"
                            ],
                            {
                              className: "h-6 w-6",
                            },
                            void 0,
                            false,
                            {
                              fileName: "[project]/src/app/page.tsx",
                              lineNumber: 187,
                              columnNumber: 9,
                            },
                            this,
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            "jsxDEV"
                          ])(
                            "span",
                            {
                              className: "sr-only",
                              children: "Add",
                            },
                            void 0,
                            false,
                            {
                              fileName: "[project]/src/app/page.tsx",
                              lineNumber: 188,
                              columnNumber: 9,
                            },
                            this,
                          ),
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 167,
                        columnNumber: 7,
                      },
                      this,
                    ),
                  },
                  void 0,
                  false,
                  {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 166,
                    columnNumber: 7,
                  },
                  this,
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: "[project]/src/app/page.tsx",
              lineNumber: 20,
              columnNumber: 5,
            },
            this,
          );
        }
        _c = Home;
        var _c;
        __turbopack_context__.k.register(_c, "Home");
        if (
          typeof globalThis.$RefreshHelpers$ === "object" &&
          globalThis.$RefreshHelpers !== null
        ) {
          __turbopack_context__.k.registerExports(
            module,
            globalThis.$RefreshHelpers$,
          );
        }
      }
    },
    "[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-client] (ecmascript)":
      (__turbopack_context__) => {
        "use strict";

        var { g: global, __dirname } = __turbopack_context__;
        {
          /**
           * @license lucide-react v0.511.0 - ISC
           *
           * This source code is licensed under the ISC license.
           * See the LICENSE file in the root directory of this source tree.
           */ __turbopack_context__.s({
            __iconNode: () => __iconNode,
            default: () => Camera,
          });
          var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              "[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)",
            );
          const __iconNode = [
            [
              "path",
              {
                d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
                key: "1tc9qg",
              },
            ],
            [
              "circle",
              {
                cx: "12",
                cy: "13",
                r: "3",
                key: "1vg3eu",
              },
            ],
          ];
          const Camera = (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "default"
          ])("camera", __iconNode);
          //# sourceMappingURL=camera.js.map
        }
      },
    "[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-client] (ecmascript) <export default as CameraIcon>":
      (__turbopack_context__) => {
        "use strict";

        var { g: global, __dirname } = __turbopack_context__;
        {
          __turbopack_context__.s({
            CameraIcon: () =>
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "default"
              ],
          });
          var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              "[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-client] (ecmascript)",
            );
        }
      },
    "[project]/node_modules/lucide-react/dist/esm/icons/file.js [app-client] (ecmascript)":
      (__turbopack_context__) => {
        "use strict";

        var { g: global, __dirname } = __turbopack_context__;
        {
          /**
           * @license lucide-react v0.511.0 - ISC
           *
           * This source code is licensed under the ISC license.
           * See the LICENSE file in the root directory of this source tree.
           */ __turbopack_context__.s({
            __iconNode: () => __iconNode,
            default: () => File,
          });
          var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              "[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)",
            );
          const __iconNode = [
            [
              "path",
              {
                d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
                key: "1rqfz7",
              },
            ],
            [
              "path",
              {
                d: "M14 2v4a2 2 0 0 0 2 2h4",
                key: "tnqrlb",
              },
            ],
          ];
          const File = (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "default"
          ])("file", __iconNode);
          //# sourceMappingURL=file.js.map
        }
      },
    "[project]/node_modules/lucide-react/dist/esm/icons/file.js [app-client] (ecmascript) <export default as File>":
      (__turbopack_context__) => {
        "use strict";

        var { g: global, __dirname } = __turbopack_context__;
        {
          __turbopack_context__.s({
            File: () =>
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "default"
              ],
          });
          var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              "[project]/node_modules/lucide-react/dist/esm/icons/file.js [app-client] (ecmascript)",
            );
        }
      },
    "[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript)":
      (__turbopack_context__) => {
        "use strict";

        var { g: global, __dirname } = __turbopack_context__;
        {
          /**
           * @license lucide-react v0.511.0 - ISC
           *
           * This source code is licensed under the ISC license.
           * See the LICENSE file in the root directory of this source tree.
           */ __turbopack_context__.s({
            __iconNode: () => __iconNode,
            default: () => Package,
          });
          var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              "[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)",
            );
          const __iconNode = [
            [
              "path",
              {
                d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
                key: "1a0edw",
              },
            ],
            [
              "path",
              {
                d: "M12 22V12",
                key: "d0xqtd",
              },
            ],
            [
              "polyline",
              {
                points: "3.29 7 12 12 20.71 7",
                key: "ousv84",
              },
            ],
            [
              "path",
              {
                d: "m7.5 4.27 9 5.15",
                key: "1c824w",
              },
            ],
          ];
          const Package = (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            "default"
          ])("package", __iconNode);
          //# sourceMappingURL=package.js.map
        }
      },
    "[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>":
      (__turbopack_context__) => {
        "use strict";

        var { g: global, __dirname } = __turbopack_context__;
        {
          __turbopack_context__.s({
            Package: () =>
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                "default"
              ],
          });
          var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              "[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript)",
            );
        }
      },
    "[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)":
      (__turbopack_context__) => {
        "use strict";

        var { g: global, __dirname } = __turbopack_context__;
        {
          /**
           * Copyright 2022 Joe Bell. All rights reserved.
           *
           * This file is licensed to you under the Apache License, Version 2.0
           * (the "License"); you may not use this file except in compliance with the
           * License. You may obtain a copy of the License at
           *
           *   http://www.apache.org/licenses/LICENSE-2.0
           *
           * Unless required by applicable law or agreed to in writing, software
           * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
           * WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
           * License for the specific language governing permissions and limitations under
           * the License.
           */ __turbopack_context__.s({
            cva: () => cva,
            cx: () => cx,
          });
          var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
            __turbopack_context__.i(
              "[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)",
            );
          const falsyToString = (value) =>
            typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
          const cx =
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              "clsx"
            ];
          const cva = (base, config) => (props) => {
            var _config_compoundVariants;
            if (
              (config === null || config === void 0
                ? void 0
                : config.variants) == null
            )
              return cx(
                base,
                props === null || props === void 0 ? void 0 : props.class,
                props === null || props === void 0 ? void 0 : props.className,
              );
            const { variants, defaultVariants } = config;
            const getVariantClassNames = Object.keys(variants).map(
              (variant) => {
                const variantProp =
                  props === null || props === void 0 ? void 0 : props[variant];
                const defaultVariantProp =
                  defaultVariants === null || defaultVariants === void 0
                    ? void 0
                    : defaultVariants[variant];
                if (variantProp === null) return null;
                const variantKey =
                  falsyToString(variantProp) ||
                  falsyToString(defaultVariantProp);
                return variants[variant][variantKey];
              },
            );
            const propsWithoutUndefined =
              props &&
              Object.entries(props).reduce((acc, param) => {
                let [key, value] = param;
                if (value === undefined) {
                  return acc;
                }
                acc[key] = value;
                return acc;
              }, {});
            const getCompoundVariantClassNames =
              config === null || config === void 0
                ? void 0
                : (_config_compoundVariants = config.compoundVariants) ===
                      null || _config_compoundVariants === void 0
                  ? void 0
                  : _config_compoundVariants.reduce((acc, param) => {
                      let {
                        class: cvClass,
                        className: cvClassName,
                        ...compoundVariantOptions
                      } = param;
                      return Object.entries(compoundVariantOptions).every(
                        (param) => {
                          let [key, value] = param;
                          return Array.isArray(value)
                            ? value.includes(
                                {
                                  ...defaultVariants,
                                  ...propsWithoutUndefined,
                                }[key],
                              )
                            : {
                                ...defaultVariants,
                                ...propsWithoutUndefined,
                              }[key] === value;
                        },
                      )
                        ? [...acc, cvClass, cvClassName]
                        : acc;
                    }, []);
            return cx(
              base,
              getVariantClassNames,
              getCompoundVariantClassNames,
              props === null || props === void 0 ? void 0 : props.class,
              props === null || props === void 0 ? void 0 : props.className,
            );
          };
        }
      },
  },
]);

//# sourceMappingURL=_7f109e89._.js.map
