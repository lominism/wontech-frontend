"use client";

import { useTranslations } from "next-intl";
import { Building2, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { type Clinic, formatClinicAddress } from "@/lib/api/clinics";

type Props = {
  clinic: Clinic;
  branches: Clinic[];
  parent?: Clinic | null;
};

export function ClinicInfoCard({ clinic, branches, parent }: Props) {
  const t = useTranslations("clinic.detail");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Building2 size={24} />
          </div>
          <CardTitle className="text-xl leading-tight">{clinic.name}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex gap-2 text-sm">
          <MapPin className="mt-0.5 shrink-0 text-muted-foreground" size={16} />
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-muted-foreground">
              {t("address")}
            </span>
            <span className="leading-relaxed whitespace-pre-line">
              {formatClinicAddress(clinic)}
            </span>
          </div>
        </div>

        <Separator />
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-muted-foreground">
            {t("parentClinic")}
          </span>
          {parent ? (
            <Link
              href={`/clinic/${parent.id}`}
              className="font-semibold text-primary hover:underline"
            >
              {parent.name}
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">{t("none")}</span>
          )}
        </div>

        {branches.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t("branches")}
              </span>
              <ul className="flex flex-col gap-1.5">
                {branches.map((branch) => (
                  <li key={branch.id}>
                    {branch.id === clinic.id ? (
                      <span className="text-sm font-semibold text-primary">
                        {branch.name}
                      </span>
                    ) : (
                      <Link
                        href={`/clinic/${branch.id}`}
                        className="text-sm font-medium hover:text-primary hover:underline"
                      >
                        {branch.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
