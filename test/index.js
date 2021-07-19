const vue = {
  handleNested () {
    ctx.$confirm("是否确定删除?", "提示", {
      type: "warning"
    }).then(() => {
      getUserInfo().then(() => {
        getPermission().then()
      })
    })
  },
  async handleDelete (row) {
    await this.$confirm('确定要删除吗？', '提示', {
      type: 'warning'
    }).then()
  },
  confirmOuterShowChange (params) {
    const res = this.$confirm('确定要删除吗？', '提示', {
      type: 'warning'
    }).then()
    return res
  },
  beforeRouteLeave (to, from, next) {
    if (this.isUpdate) {
      next(false)
      setTimeout(() => {
        this.$confirm('检测到未保存的内容，退出后将会丢失，是否继续？', '确认信息', {
          type: 'warning'
        }).then(() => {
          this.isUpdate = false
          next()
        })
      }, 0)
    } else {
      next()
    }
  },
  prompt () {
    $prompt('请输入邮箱', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
      inputErrorMessage: '邮箱格式不正确'
    }).then(({ value }) => {
      this.$message({
        type: 'success',
        message: '你的邮箱是: ' + value
      })
    })
  },
  msgbox () {
    this.$msgbox({
      title: '消息',
      message: '消息内容',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = '执行中...';
          setTimeout(() => {
            done()
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 300)
          }, 3000)
        } else {
          done()
        }
      }
    }).then(action => {
      this.$message({
        type: 'info',
        message: 'action: ' + action
      })
    })
  }
}

export const handleDeleteCalendar = function (row) {
  this.$confirm('确定要删除吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    this.loading = true
    const res = await this.$delete('/payroll/xxx', {
      id: row.rootEntityDataId
    })
    if (!res) {
      this.loading = false
      return
    }
    await this.loadList()
    this.$message({
      type: 'success',
      message: '删除成功'
    })
  })
}
