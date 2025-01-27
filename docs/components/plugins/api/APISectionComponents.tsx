import React from 'react';

import { InlineCode } from '~/components/base/code';
import { B, P } from '~/components/base/paragraph';
import { H2, H3Code } from '~/components/plugins/Headings';
import {
  CommentData,
  GeneratedData,
  MethodSignatureData,
  PropsDefinitionData,
} from '~/components/plugins/api/APIDataTypes';
import APISectionProps from '~/components/plugins/api/APISectionProps';
import {
  CommentTextBlock,
  resolveTypeName,
  getComponentName,
} from '~/components/plugins/api/APISectionUtils';

export type APISectionComponentsProps = {
  data: GeneratedData[];
  componentsProps: PropsDefinitionData[];
};

const getComponentComment = (comment: CommentData, signatures: MethodSignatureData[]) =>
  comment || (signatures?.[0]?.comment ?? undefined);

const renderComponent = (
  { name, comment, type, extendedTypes, children, signatures }: GeneratedData,
  componentsProps?: PropsDefinitionData[]
): JSX.Element => {
  const resolvedType = extendedTypes?.length ? extendedTypes[0] : type;
  const resolvedName = getComponentName(name, children);
  return (
    <div key={`component-definition-${resolvedName}`}>
      <H3Code>
        <InlineCode>{resolvedName}</InlineCode>
      </H3Code>
      {resolvedType && (
        <P>
          <B>Type:</B> <InlineCode>{resolveTypeName(resolvedType)}</InlineCode>
        </P>
      )}
      <CommentTextBlock comment={getComponentComment(comment, signatures)} />
      {componentsProps && componentsProps.length ? (
        <APISectionProps data={componentsProps} header={`${resolvedName}Props`} />
      ) : null}
    </div>
  );
};

const APISectionComponents = ({ data, componentsProps }: APISectionComponentsProps) =>
  data?.length ? (
    <>
      <H2 key="components-header">Components</H2>
      {data.map(component =>
        renderComponent(
          component,
          componentsProps.filter(cp =>
            cp.name.includes(getComponentName(component.name, component.children))
          )
        )
      )}
    </>
  ) : null;

export default APISectionComponents;
