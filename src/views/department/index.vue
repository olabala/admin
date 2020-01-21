<template>
  <div class="app-container depts-container">
    <template v-if="hasDept">
      <vue2-org-tree
        name="组织结构树"
        :data="depts"
        @on-expand="onExpand"
        @on-node-click="onNodeClick"
      />
    </template>
    <template v-else>
      <div class="empty">
        <svg-icon icon-class="empty" />
        <div class="hint">您的组织架构为空，快<el-button type="text" @click="handleAdd('firstAdd')">点我</el-button>新建一个吧！</div>
      </div>
    </template>
    <el-dialog :visible.sync="visible" :title="dialogTitle" :width="'33%'">
      <div v-if="!operator">
        当前操作部门：{{ activeDept.label }}
      </div>
      <div v-else>
        <el-form ref="deptForm" :rules="rules" :model="deptForm" label-width="80px">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="deptForm.deptName" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <template v-if="!['firstAdd', 'add', 'update'].includes(operator)">
          <el-button
            v-if="!activeDept.hasParent"
            size="medium"
            icon="el-icon-document-add"
            @click="handleAdd('add')"
          >
            新增
          </el-button>
          <el-button
            size="medium"
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate"
          >
            编辑
          </el-button>
          <el-button
            size="medium"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete"
          >
            删除
          </el-button>
        </template>
        <template v-else>
          <el-button size="medium" @click="handleCancel">
            取消
          </el-button>
          <el-button size="medium" :loading="dialoadLoading" type="primary" @click="handleConfirm">
            确认
          </el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { parseTree } from '@/utils'
import { getDepts, addDept, updateDept, deleteDept } from '@/api/department'
export default {
  data() {
    return {
      depts: {},
      horizontal: false,
      collapsable: false,
      expandAll: false,
      visible: false,
      activeDept: {},
      operator: '',
      dialoadLoading: false,
      deptForm: {
        deptName: ''
      },
      rules: {
        deptName: [{ required: true, trigger: 'blur', message: '请输入部门名称' }]
      }
    }
  },
  computed: {
    hasDept() {
      return Object.keys(this.depts).length > 0
    },
    dialogTitle() {
      switch (this.operator) {
        case 'add':
        case 'firstAdd':
          return '新增部门'
        case 'edit':
          return '编辑部门'
        default:
          return '部门操作'
      }
    }
  },
  watch: {
    visible(newVal) {
      this.$refs.deptForm && newVal && this.$refs.deptForm.clearValidate()
    }
  },
  created() {
    this.getDepts()
  },
  methods: {
    getDepts() {
      getDepts().then(response => {
        this.depts = parseTree(response)
      })
    },
    handleCancel() {
      if (this.operator === 'firstAdd') {
        this.visible = false
      } else {
        this.operator = ''
      }
    },
    handleAdd(operator = 'add') {
      this.deptForm.deptName = ''
      if (this.visible === false) {
        this.visible = true
      }
      this.operator = operator
    },
    handleUpdate() {
      this.deptForm.deptName = this.activeDept.label
      this.operator = 'update'
    },
    handleDelete() {
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDept({ uuid: this.activeDept.id }).then(response => {
          this.getDepts()
          this.visible = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(_ => {})
    },
    renderContent(h, data) {
      return data.label
    },
    onExpand(data) {
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    onNodeClick(e, data) {
      this.visible = true
      this.operator = ''
      this.activeDept = data
    },
    handleConfirm() {
      switch (this.operator) {
        case 'add':
        case 'firstAdd':
          this.deptForm.parentDeptId = this.activeDept.id
          addDept(this.deptForm).then(response => {
            this.getDepts()
            this.visible = false
            this.$message({
              type: 'success',
              message: '添加成功！'
            })
          })
          break
        case 'update':
          this.deptForm.uuid = this.activeDept.id
          updateDept(this.deptForm).then(response => {
            this.getDepts()
            this.visible = false
            this.$message({
              type: 'success',
              message: '修改成功！'
            })
          })
          break
      }
    }
  }
}
</script>

<style scoped>
  .depts-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .org-tree-container {
    padding-bottom: 240px;
  }
  .svg-icon {
    display: flex;
    width: 320px;
    height: 320px;
  }
  .hint {
    margin-top: 36px;
    font-size: 14px;
    text-align: center;
  }
</style>
