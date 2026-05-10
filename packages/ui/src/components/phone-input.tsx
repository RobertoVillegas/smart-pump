import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { Input } from "@workspace/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "ref" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value | "") => void;
  };

interface CountryEntry {
  label: string;
  value: RPNInput.Country | undefined;
}

interface CountrySelectProps {
  disabled?: boolean;
  onChange: (country: RPNInput.Country) => void;
  options: CountryEntry[];
  value: RPNInput.Country;
}

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    className={cn("rounded-e-md rounded-s-none", className)}
    {...props}
  />
));
InputComponent.displayName = "InputComponent";

const countryCodePointOffset = 127_397;

const getRegionalIndicatorSymbol = (letter: string) => {
  const codePoint = letter.codePointAt(0);

  if (codePoint === undefined) {
    return "";
  }

  return String.fromCodePoint(codePoint + countryCodePointOffset);
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const flag = country.replaceAll(/./gu, getRegionalIndicatorSymbol);

  return (
    <span
      aria-label={countryName}
      className="flex h-5 w-7 items-center justify-center text-xl leading-none"
      role="img"
    >
      {flag}
    </span>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
  selectedCountry: RPNInput.Country;
}

const setCountryItemRef = (element: HTMLDivElement | null) => {
  if (!element) {
    return;
  }

  // cmdk calls scrollIntoView on the selected item after mount. In a portaled
  // popover that can scroll the page, so keep the scroll scoped to the list.
  element.scrollIntoView = () => {
    element
      .closest("[data-slot='command-list']")
      ?.scrollTo({ top: element.offsetTop });
  };
};

const CountrySelectOption = ({
  country,
  countryName,
  onChange,
  onSelectComplete,
  selectedCountry,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem
      ref={setCountryItemRef}
      className="gap-2"
      keywords={[countryName]}
      onSelect={handleSelect}
      value={country}
    >
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-foreground/50 text-sm">
        +{RPNInput.getCountryCallingCode(country)}
      </span>
      <CheckIcon
        className={cn(
          "ml-auto size-4",
          country === selectedCountry ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
};

const CountrySelect = ({
  disabled,
  onChange,
  options: countryList,
  value: selectedCountry,
}: CountrySelectProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      modal
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setSearchValue("");
        }
      }}
    >
      <PopoverTrigger
        type="button"
        aria-label="Select country"
        className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-s-md border border-input border-r-0 bg-background px-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus:z-10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:border-input dark:bg-input/30"
        disabled={disabled}
      >
        <FlagComponent
          country={selectedCountry}
          countryName={selectedCountry}
        />
        <ChevronsUpDownIcon
          className={cn("-mr-2 size-4 opacity-50", disabled && "hidden")}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] gap-0 p-0"
        collisionAvoidance={{
          align: "shift",
          fallbackAxisSide: "none",
          side: "flip",
        }}
        collisionPadding={12}
        initialFocus={(openType) => openType === "keyboard"}
        side="top"
      >
        <Command value={selectedCountry}>
          <CommandInput
            placeholder="Search country..."
            value={searchValue}
            onValueChange={(nextValue) => {
              setSearchValue(nextValue);
              requestAnimationFrame(() => {
                scrollAreaRef.current?.scrollTo({ top: 0 });
              });
            }}
          />
          <CommandList ref={scrollAreaRef}>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countryList.map(({ label, value }) =>
                value ? (
                  <CountrySelectOption
                    key={value}
                    country={value}
                    countryName={label}
                    selectedCountry={selectedCountry}
                    onChange={onChange}
                    onSelectComplete={() => setIsOpen(false)}
                  />
                ) : null
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, value, ...props }, ref) => (
  <RPNInput.default
    ref={ref}
    className={cn("flex", className)}
    countrySelectComponent={CountrySelect}
    flagComponent={FlagComponent}
    inputComponent={InputComponent}
    smartCaret={false}
    value={value || undefined}
    onChange={(nextValue) => onChange?.(nextValue ?? "")}
    {...props}
  />
));
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
