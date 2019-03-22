import * as React from 'react';
export interface IFormWidgetProps {
  labelName?: string;
  type?: string;
  ajaxurl?: string;
  assignmentUrl?: string;
  fieldId?: string;
  fieldPid: string;
  fieldName?: string;
  fieldType?: string;
  fieldLength?: number;
  fieldDecimalLength?: number;
  fieldIsnull?: number;
  fieldDefaultValue?: string;
  fieldDefaultValueName?: string;
  fieldIsAutoIncrement?: number;
  fieldOrderno?: number;
  fieldIswf?: number;
  fieldIsOwer?: number;
  fieldIsshow?: number;
  fieldIsdel?: number;
  fieldIssubmit?: number;
  fieldIssubmitDept?: number;
  fieldIsname?: number;
  fieldContent?: string;
  fieldEnable?: number;
  fieldLineWidth?: number;
  fieldRegexl?: string;
  fieldErrmsg?: string;
  fieldFormat?: string;
  fieldLimit?: string;
  fieldLayout?: string;
  needDetail?: number;
  maxFileCount?: number;
  formula?: string;
  itemLinkeds?: any[];
  prefixCls?: string;
  validateStatus?: 'success' | 'warning' | 'error' | 'validating';
}
export default class FormWidget extends React.Component<IFormWidgetProps, any> {

}
