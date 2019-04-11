import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class ProcessTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      needTotalList
    };
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data: { list, pagination },loading,columns, rowKey, scroll,rowSelection, click,showPagination,notShowAlert, ...rest } = this.props;

    const paginationProps = showPagination && {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const onClose = function (e) {
    };
    return (
      <div className={styles.standardTable}>

        {notShowAlert?(<span></span>):(<div className={styles.tableAlert}><Alert
          message={
            <Fragment>
              共筛选<a style={{ fontWeight: 600 }}>{pagination.total}</a>条符合条件的事项。
            </Fragment>
          }
          type="info"
          showIcon
          onClose={onClose}
          closable
        /></div>)}

        <Table
          loading={loading}
          rowKey={rowKey || 'id'}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          scroll={scroll}
          rowSelection={rowSelection}
          onChange={this.handleTableChange}
          onRow={this.props.click}
          {...rest}
        />
      </div>
    );
  }
}

export default ProcessTable;
