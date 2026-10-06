"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Mail, MapPin, Pencil, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { type Influencer, formatInfluencerAddress } from "@/lib/api/influencers";
import { EditInfluencerContactDialog } from "./EditInfluencerContactDialog";

type Props = {
  influencer: Influencer;
  peers: Influencer[];
};

export function InfluencerInfoCard({ influencer, peers }: Props) {
  const t = useTranslations("influencer.detail");
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Building2 size={24} />
            </div>
            <CardTitle className="text-xl leading-tight">
              {influencer.name}
            </CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground"
            onClick={() => setEditOpen(true)}
          >
            <Pencil size={14} />
            {t("editContact.trigger")}
          </Button>
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
              {formatInfluencerAddress(influencer)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 text-sm">
          <Mail className="mt-0.5 shrink-0 text-muted-foreground" size={16} />
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-muted-foreground">
              {t("contactEmail")}
            </span>
            {influencer.contactEmail ? (
              <a
                href={`mailto:${influencer.contactEmail}`}
                className="leading-relaxed break-all hover:text-primary hover:underline"
              >
                {influencer.contactEmail}
              </a>
            ) : (
              <span className="leading-relaxed text-muted-foreground">
                {t("none")}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 text-sm">
          <Phone className="mt-0.5 shrink-0 text-muted-foreground" size={16} />
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-muted-foreground">
              {t("contactPhone")}
            </span>
            {influencer.contactPhone ? (
              <a
                href={`tel:${influencer.contactPhone}`}
                className="leading-relaxed hover:text-primary hover:underline"
              >
                {influencer.contactPhone}
              </a>
            ) : (
              <span className="leading-relaxed text-muted-foreground">
                {t("none")}
              </span>
            )}
          </div>
        </div>

        <Separator />
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-muted-foreground">
            {t("agency")}
          </span>
          {influencer.agencyName ? (
            <span className="font-semibold text-primary">
              {influencer.agencyName}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">{t("none")}</span>
          )}
        </div>

        {peers.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t("peers")}
              </span>
              <ul className="flex flex-col gap-1.5">
                {peers.map((peer) => (
                  <li key={peer.id}>
                    <Link
                      href={`/influencer/${peer.id}`}
                      className="text-sm font-medium hover:text-primary hover:underline"
                    >
                      {peer.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>

      <EditInfluencerContactDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        influencer={influencer}
      />
    </Card>
  );
}
