import { deactivateStylistAction, saveStylistAction } from "@/lib/booking/setup-actions";
import type {
  BookableServiceOptionDto,
  StaffSetupDto,
} from "@/lib/booking/setup-queries";

type StylistSetupFormProps = {
  stylist?: StaffSetupDto;
  services: BookableServiceOptionDto[];
};

function groupServicesByCategory(services: BookableServiceOptionDto[]) {
  return services.reduce<Record<string, BookableServiceOptionDto[]>>((groups, service) => {
    groups[service.category] = [...(groups[service.category] ?? []), service];

    return groups;
  }, {});
}

export function StylistSetupForm({ stylist, services }: StylistSetupFormProps) {
  const assignedServiceIds = new Set(
    stylist?.assignedServices.map((service) => service.serviceId) ?? []
  );
  const allServicesSelected =
    !stylist || assignedServiceIds.size === services.length;
  const groupedServices = groupServicesByCategory(services);

  return (
    <div className="space-y-4">
      <form action={saveStylistAction} className="space-y-5">
        {stylist ? <input name="id" type="hidden" value={stylist.id} /> : null}

        <label className="block">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Stylistin oder Stylist
          </span>
          <input
            className="mt-2 w-full rounded-lg border border-[var(--line-strong)] bg-white/80 px-3 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:bg-white/5 dark:text-zinc-50 dark:focus:border-zinc-100"
            name="name"
            required
            defaultValue={stylist?.name ?? ""}
          />
        </label>

        <label className="flex items-center gap-3 text-sm text-zinc-800 dark:text-zinc-200">
          <input name="active" type="hidden" value="false" />
          <input
            className="h-4 w-4 rounded border-[var(--line-strong)]"
            name="active"
            type="checkbox"
            value="true"
            defaultChecked={stylist?.active ?? true}
          />
          Aktiv
        </label>

        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Leistungen
            </div>
            <label className="mt-3 flex items-center gap-3 text-sm text-zinc-800 dark:text-zinc-200">
              <input name="allServices" type="hidden" value="false" />
              <input
                className="h-4 w-4 rounded border-[var(--line-strong)]"
                name="allServices"
                type="checkbox"
                value="true"
                defaultChecked={allServicesSelected}
              />
              Alle Leistungen
            </label>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Einzelne Leistungen
            </div>
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <fieldset
                key={category}
                className="rounded-lg border border-[var(--line)] p-4"
              >
                <legend className="px-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {category}
                </legend>
                <div className="mt-3 grid gap-2">
                  {categoryServices.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      <input
                        className="mt-1 h-4 w-4 rounded border-[var(--line-strong)]"
                        name="serviceIds"
                        type="checkbox"
                        value={service.id}
                        defaultChecked={
                          !stylist || assignedServiceIds.has(service.id)
                        }
                      />
                      <span>
                        <span className="block font-medium text-zinc-900 dark:text-zinc-100">
                          {service.title}
                        </span>
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                          {service.id}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </div>

        <button
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:w-auto dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          type="submit"
        >
          Speichern
        </button>
      </form>

      {stylist ? (
        <form action={deactivateStylistAction}>
          <input name="id" type="hidden" value={stylist.id} />
          <button
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[var(--line-strong)] px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900 sm:w-auto dark:text-zinc-100 dark:hover:border-zinc-100"
            type="submit"
          >
            Deaktivieren
          </button>
        </form>
      ) : null}
    </div>
  );
}
