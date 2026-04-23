"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select items...", disabled }: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          onChange(selected.slice(0, -1));
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, [selected, onChange]);

  const selectables = options.filter((option) => !selected.includes(option.value));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div
        className="group border border-white/10 px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 bg-white/5"
      >
        <div className="flex gap-1 flex-wrap">
          {selected.map((val) => {
            const option = options.find((o) => o.value === val);
            if (!option) return null;
            return (
              <Badge key={option.value} variant="secondary" className="bg-indigo-600/30 text-indigo-100 hover:bg-indigo-600/50">
                {option.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option.value);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option.value)}
                  type="button"
                  disabled={disabled}
                >
                  <X className="h-3 w-3 text-white/70 hover:text-white" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : undefined}
            disabled={disabled}
            className="ml-2 bg-transparent outline-none placeholder:text-gray-500 flex-1 text-white disabled:opacity-50"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border border-white/10 bg-neutral-900 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        onChange([...selected, option.value]);
                      }}
                      className={"cursor-pointer text-white hover:bg-white/10 aria-selected:bg-indigo-600"}
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
