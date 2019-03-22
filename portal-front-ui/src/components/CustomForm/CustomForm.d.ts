import * as React from 'react';
import * as PropTypes from 'prop-types';
import FormItem from './FormWidget';
import { Omit } from 'omit.js';
declare type FormCreateOptionMessagesCallback = (...args: any[]) => string;
interface IFormCreateOptionMessages {
    [messageId: string]: string | FormCreateOptionMessagesCallback | IFormCreateOptionMessages;
}
export interface IFormCreateOption<T> {
    onFieldsChange?: (props: T, fields: object, allFields: any, add: string) => void;
    onValuesChange?: (props: T, changedValues: any, allValues: any) => void;
    mapPropsToFields?: (props: T) => void;
    validateMessages?: IFormCreateOptionMessages;
    withRef?: boolean;
}
export declare type FormLayout = 'normal' | 'grid-2' | 'grid-3';
export interface IFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    layout?: FormLayout;
    form?: WrappedFormUtils;
    onSubmit?: React.FormEventHandler<any>;
    style?: React.CSSProperties;
    className?: string;
    prefixCls?: string;
    hideRequiredMark?: boolean;
}
export declare type GetFieldDecoratorOptions = {
    /** 子节点的值的属性，如 Checkbox 的是 'checked' */
    valuePropName?: string;
    /** 子节点的初始值，类型、可选值均由子节点决定 */
    initialValue?: any;
    /** 收集子节点的值的时机 */
    trigger?: string;
    /** 可以把 onChange 的参数转化为控件的值，例如 DatePicker 可设为：(date, dateString) => dateString */
    getValueFromEvent?: (...args: any[]) => any;
    /** Get the component props according to field value. */
    getValueProps?: (value: any) => any;
    /** 校验子节点值的时机 */
    validateTrigger?: string | string[];
    /** 是否和其他控件互斥，特别用于 Radio 单选控件 */
    exclusive?: boolean;
    /** Normalize value to form component */
    normalize?: (value: any, prevValue: any, allValues: any) => any;
    /** Whether stop validate on first rule of error for this field.  */
    validateFirst?: boolean;
};
export declare type WrappedFormUtils = {
    /** 获取一组输入控件的值，如不传入参数，则获取全部组件的值 */
    getFieldsValue(fieldNames?: Array<string>): Object;
    /** 获取一个输入控件的值*/
    getFieldValue(fieldName: string): any;
    /** 设置一组输入控件的值*/
    setFieldsValue(obj: Object): void;
    /** 设置一组输入控件的值*/
    setFields(obj: Object): void;
    /** 校验并获取一组输入域的值与 Error */
    validateFields(): void;
    /** 获取某个输入控件的 Error */
    getFieldError(name: string): Object[];
    getFieldsError(names?: Array<string>): Object;
    /** 判断一个输入控件是否在校验状态*/
    isFieldValidating(name: string): boolean;
    isFieldTouched(name: string): boolean;
    isFieldsTouched(names?: Array<string>): boolean;
    /** 重置一组输入控件的值与状态，如不传入参数，则重置所有组件 */
    resetFields(names?: Array<string>): void;
    getFieldDecorator<T extends Object = {}>(fieldId: keyof T, options?: GetFieldDecoratorOptions): (node: React.ReactNode) => React.ReactNode;
};
export interface IFormComponentProps {
    form: WrappedFormUtils;
}
export interface IRcBaseFormProps {
    wrappedComponentRef?: any;
}
export interface IComponentDecorator {
    <P extends IFormComponentProps>(component: React.ComponentClass<P> | React.SFC<P>): React.ComponentClass<IRcBaseFormProps & Omit<P, keyof IFormComponentProps>>;
}
export default class Form extends React.Component<IFormProps, any> {
    static create: <TOwnProps>(options?: IFormCreateOption<TOwnProps>) => IComponentDecorator;
    constructor(props: IFormProps);
}
export {};
