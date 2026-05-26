import React from "react";
import { StylesResultProps } from '@grapesjs/react';
import StylePropertyField from "./style-property-field";
import style from "./style-manager.module.scss";
import type { Property } from "grapesjs";
import { FILTERED_TEXT_PROPERTIES } from "./constants";

interface StyleManagerProps extends Omit<StylesResultProps, 'Container'> {
  customFieldComponents?: Record<string, React.ComponentType<{ prop: Property }>>;
}

export default function StyleManager({ sectors, customFieldComponents }: StyleManagerProps) {
  return (
    <div className={`${style["style-manager"]} style-manager text-left`}>
      {sectors.map(sector => (
        <div className={`mb-25 ${style?.["mb-25"]}`} key={sector?.id}>
            {sector?.getProperties()
            ?.filter((property) => !FILTERED_TEXT_PROPERTIES?.includes(property?.attributes?.property as string))
            ?.map(prop => {
              const CustomComponent = customFieldComponents?.[prop.getType()];
              return (
                <div className={`style-property-field-container mb-25 ${style?.["mb-25"]}`} key={prop?.id}>
                  {CustomComponent 
                    ? <CustomComponent key={prop?.getId()} prop={prop} />
                    : <StylePropertyField key={prop?.getId()} prop={prop} />
                  }
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
}
