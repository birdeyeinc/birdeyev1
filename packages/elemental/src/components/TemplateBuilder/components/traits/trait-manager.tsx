import React from 'react';
import { TraitsResultProps } from '@grapesjs/react';
import TraitPropertyField from './trait-property-field';
import style from './trait-manager.module.scss';
import type { Trait } from 'grapesjs';
import { FILTERED_TRAITS } from 'components/TemplateBuilder/utils/constants';

interface TraitManagerProps extends Omit<TraitsResultProps, 'Container'> {
  customTraitFields?: Record<string, React.ComponentType<{ trait: Trait }>>;
}

export default function TraitManager({ traits, customTraitFields }: TraitManagerProps) {
  return (
    <div className={`text-left trait-manager ${style?.["trait-manager"]}`}>
      {!traits.length ? (
        null
      ) : (
        traits
        ?.filter((trait) => !FILTERED_TRAITS.includes(trait?.getLabel()))
        ?.map(trait => {
          const CustomComponent = customTraitFields?.[trait.getType()];
          return CustomComponent
            ? <CustomComponent key={trait.getId()} trait={trait} />
            : <TraitPropertyField key={trait.getId()} trait={trait} />;
        })
      )}
    </div>
  );
}
