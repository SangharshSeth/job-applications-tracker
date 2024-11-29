import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { ChevronRight } from 'lucide-react';

const CustomBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight />
        </BreadcrumbSeparator>
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          return (
            <React.Fragment key={routeTo}>
              <BreadcrumbItem>
                <BreadcrumbLink href={routeTo} className="hover:underline">
                  {pathname.charAt(0).toUpperCase() + pathname.slice(1)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < pathnames.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;