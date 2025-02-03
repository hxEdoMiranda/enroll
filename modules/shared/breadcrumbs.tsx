"use client";

import { usePathname } from "next/navigation";
import { Fragment, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TBreadCrumbProps = {
  separator: ReactNode;
  containerClasses?: string;
  capitalizeLinks?: boolean;
};

const slugFormat = new Map();
slugFormat.set("empresas", "Empresas");
slugFormat.set("configuraciones", "Configuraciones");
slugFormat.set("nom035", "NOM035");

const Breadcrumbs = ({
  separator,
  containerClasses,
  capitalizeLinks,
}: TBreadCrumbProps) => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-4", containerClasses)}>
      <ol className="flex items-center list-none">
        <li>
          <Button
            variant="link"
            className={cn(
              "p-0 mr-6 font-medium",
              paths === "/"
                ? "text-primary font-semibold hover:text-primary/90"
                : "text-sm text-muted-foreground hover:text-muted-foreground/90"
            )}
            aria-current={paths === "/" ? "page" : undefined}
          >
            <Link href={"/"}>Inicio </Link>
          </Button>
        </li>

        {pathNames.length > 0 && (
          <li aria-hidden="true" className="mr-6">
            {separator}
          </li>
        )}

        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          let itemLink = slugFormat.get(link) ? slugFormat.get(link) : link;
          itemLink = capitalizeLinks
            ? itemLink.charAt(0).toUpperCase() + itemLink.slice(1)
            : itemLink;

          const isLastItem = pathNames.length === index + 1;

          return (
            <Fragment key={index}>
              <li>
                <Button
                  variant="link"
                  className={cn(
                    "p-0 font-mediumw",
                    isLastItem
                      ? "text-primary font-semibold text-black hover:text-primary/90"
                      : "text-sm text-muted-foreground hover:text-muted-foreground/90"
                  )}
                  aria-current={isLastItem ? "page" : undefined}
                >
                  <Link href={href}>{itemLink}</Link>
                </Button>
              </li>
              {!isLastItem && (
                <li aria-hidden="true" className="mx-6">
                  {separator}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
