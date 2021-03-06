import React from 'react'
import { PreviewText } from '@formily/react-shared-components'
import {
  IConnectProps,
  MergedFieldComponentProps
} from '@formily/react-schema-renderer'
import { version } from 'antd'
import { each } from '@formily/shared'
export * from '@formily/shared'

export const isAntdV4 = /^4\./.test(version)

export const autoScrollInValidateFailed = (formRef: any) => {
  if (formRef.current) {
    setTimeout(() => {
      const elements = formRef.current.querySelectorAll(
        '.ant-form-item-control.has-error'
      )
      if (elements && elements.length) {
        if (!elements[0].scrollIntoView) return
        elements[0].scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'center'
        })
      }
    }, 30)
  }
}

export const mapTextComponent = (
  Target: React.JSXElementConstructor<any>,
  props: any,
  fieldProps: any = {}
): React.JSXElementConstructor<any> => {
  const { editable } = fieldProps
  if (editable !== undefined) {
    if (editable === false) {
      return PreviewText
    }
  }
  return Target
}

export const transformDataSourceKey = (component, dataSourceKey) => {
  return ({ dataSource, ...others }) => {
    return React.createElement(component, {
      [dataSourceKey]: dataSource,
      ...others
    })
  }
}

export const normalizeCol = (
  col: { span: number; offset?: number } | number,
  defaultValue?: { span: number }
): { span: number; offset?: number } => {
  if (!col) {
    return defaultValue
  } else {
    return typeof col === 'object' ? col : { span: Number(col) }
  }
}

export const pickProps = (object: any, targets: string[]) => {
  const selected: any = {}
  const otherwise: any = {}
  each(object, (value: any, key: string) => {
    if (targets.includes(key)) {
      selected[key] = value
    } else {
      otherwise[key] = value
    }
  })
  return {
    selected,
    otherwise
  }
}

const NextFormItemProps = [
  'colon',
  'htmlFor',
  'validateStatus',
  'prefixCls',
  'required',
  'labelAlign',
  'hasFeedback',
  'labelCol',
  'wrapperCol',
  'label',
  'help',
  'extra',
  'itemStyle',
  'itemClassName',
  'addonAfter'
]

export const pickFormItemProps = (props: any) => {
  const { selected } = pickProps(props, NextFormItemProps)
  if (!props.label && props.title) {
    selected.label = props.title
  }
  if (!props.help && props.description) {
    selected.help = props.description
  }
  if (selected.itemStyle) {
    selected.style = selected.itemStyle
    delete selected.itemStyle
  }
  if (selected.itemClassName) {
    selected.className = selected.itemClassName
    delete selected.itemClassName
  }
  return selected
}

export const pickNotFormItemProps = (props: any) => {
  return pickProps(props, NextFormItemProps).otherwise
}

export const mapStyledProps = (
  props: IConnectProps,
  fieldProps: MergedFieldComponentProps
) => {
  const { loading, errors } = fieldProps
  if (loading) {
    props.state = props.state || 'loading'
  } else if (errors && errors.length) {
    props.state = 'error'
  }
}

export const compose = (...args: any[]) => {
  return (payload: any, ...extra: any[]) => {
    return args.reduce((buf, fn) => {
      return buf !== undefined ? fn(buf, ...extra) : fn(payload, ...extra)
    }, payload)
  }
}
