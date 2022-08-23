/**
 * @file scoped.jsx.
 * @author fex
 */

import React from 'react';
import {extendObject, RendererProps, ucFirst, getPropValue} from 'amis-core';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {SchemaClassName} from '../../Schema';
import {SchemaPopOver} from '../PopOver';
import {SchemaQuickEdit} from '../QuickEdit';
import {SchemaCopyable} from '../Copyable';
import {StaticFieldRenderer} from './Static';

export interface ControlStaticProps {
  /**
   * 是否静态展示
   */
  static?: boolean;

  /**
   * 静态展示时的占位 支持 HTML
   */
  staticPlaceholder?: any;

  /**
   * 静态展示control的 className
   */
  staticClassName?: SchemaClassName;

  /**
   * 配置查看详情功能
   */
  staticPopOver?: SchemaPopOver;

  /**
   * 配置快速编辑功能
   */
  staticQuickEdit?: SchemaQuickEdit;

  /**
   * 配置点击复制功能
   */
  staticCopyable?: SchemaCopyable;

  /**
   * 边框模式，默认是无边框的
   */
  staticBorderMode?: 'full' | 'half' | 'none';

  /**
   * 配置自定义静态展示态
   */
  staticSchema?: any;
}

export interface PresetStaticProps
  extends Omit<ControlStaticProps, 'static' | 'staticClassName'> {
  /**
   * 自定义静态展示组件，默认没有，直接展示文字
   */
  StaticComponent?: React.ComponentType<any>;
  /**
   * 自定义静态展示组件 的 额外参数
   */
  StaticComponentProps?: any;
}

export const HocStatic =
  (presetStaticProps: PresetStaticProps = {}) =>
  (NormalComponent: React.ComponentType<any>): any => {
    class HocComponent extends React.Component<
      ControlStaticProps & RendererProps,
      any
    > {
      constructor(props: any) {
        super(props);
        this.handleQuickChange = this.handleQuickChange.bind(this);
      }

      async handleQuickChange(values: any, saveImmediately: boolean | any) {
        const {onBulkChange, onAction, data} = this.props;

        if (saveImmediately && saveImmediately.api) {
          await onAction(
            null,
            {
              actionType: 'ajax',
              api: saveImmediately.api
            },
            extendObject(data, values),
            true
          );
        }

        onBulkChange && onBulkChange(values, saveImmediately === true);
      }

      getConfig(key: keyof PresetStaticProps) {
        return this.props[key] === true && presetStaticProps[key]
          ? presetStaticProps[key]
          : this.props[key] || undefined;
      }

      renderBody(displayValue: any) {
        const {render, value, staticSchema} = this.props;
        // 外部传入 schema
        if (staticSchema) {
          return render('form-static-state', staticSchema);
        }
        // 内部使用hoc时传的 schema
        if (presetStaticProps.staticSchema) {
          const { inputFormat } = this.props;
          return render('form-static-state', presetStaticProps.staticSchema, {
            value: displayValue,
            tpl: displayValue,
            text: displayValue,
            ...inputFormat && {format: inputFormat}
          });
        }
        // 内部使用hoc时传的 jsx组件
        if (presetStaticProps.StaticComponent) {
          return (
            <presetStaticProps.StaticComponent
              {...{
                ...this.props,
                value: displayValue,
                ...presetStaticProps?.StaticComponentProps
              }}
            />
          );
        }
        return null;
      }

      getDisplayValue() {
        const {
          type,
          staticPlaceholder = '',
          selectedOptions
        } = this.props;
        let value = getPropValue(this.props) || staticPlaceholder;
        switch (type) {
          case 'input-password':
            return '********';
        }
        if (selectedOptions && selectedOptions?.length > 0) {
          value = selectedOptions
            .map((item: any) => item.label || '')
            .join(', ')
        }
        return value;
      }

      render() {
        const {
          static: isStatic,
          classnames: cx,
          staticBorderMode,
          staticClassName,
          type
        } = this.props;

        if (!isStatic) {
          return <NormalComponent {...this.props} />;
        }

        switch (type) {
          case 'input-rating':
          case 'checkbox':
          case 'matrix-checkboxes':
          case 'list-select':
            return <NormalComponent
              {...this.props}
              disabled={true}
              className={cx('Form-static is-static', staticClassName)}
            />;
          case 'combo':
            return <NormalComponent
              {...this.props}
              disabled={true}
              addable={false}
              removable={false}
            />;
        }

        const displayValue = this.getDisplayValue();

        // 一期暂不支持高级自定义
        // const getCopyableConfig = () => {
        //   let config = this.getConfig('staticCopyable');
        //   // why do this
        //   // copyable.content 默认根据${name}取值
        //   // 当设定了 staticPlaceholder 但${name}为空无法展示 复制图标
        //   return config === true && value ? {content: value} : config;
        // };

        // const getPopOverConfig = () => {
        //   let config = this.getConfig('staticPopOver');
        //   return config === true && value
        //     ? {
        //         type: 'panel',
        //         body: value
        //       }
        //     : config;
        // };

        // const getQuickEditConfig = () => {
        //   let config = this.getConfig('staticQuickEdit');
        //   return config === true && value
        //     ? {
        //       ...this.props,
        //       static: false,
        //       value
        //     }
        //     : config;
        // };

        return (
          <div
            className={cx('Form-static is-static', staticClassName, {
              [`Form-static--border${ucFirst(staticBorderMode)}`]:staticBorderMode,
            })}
          >
            <StaticFieldRenderer
              {...{
                ...this.props,
                onQuickChange: this.handleQuickChange,
                // copyable: getCopyableConfig(),
                // quickEdit: getQuickEditConfig(),
                // popOver: getPopOverConfig(),
                copyable: false,
                quickEdit: false,
                popOver: false,
                value: displayValue,
                placeholder: '-'
              }}
            >
              {this.renderBody(displayValue)}
            </StaticFieldRenderer>
          </div>
        );
      }
    }
    hoistNonReactStatic(HocComponent, NormalComponent);
    return HocComponent;
  };

export default HocStatic;
