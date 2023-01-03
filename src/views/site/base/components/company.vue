
<script setup lang='ts'>
import { CommonUpload } from '@/components/common'
import { ref } from 'vue'
import { UseCompanyForm, UseCompanyOperation } from '../shared/useCompany.service'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { MaterFileType } from '@/api/api.model'

const {
  businessList, industrySource, industryList,
  companyTypeList, marketList, employeesList,
} = await new UseCompanyOperation().useCompany()
const { modelRule, modelRef, onSubmit } = await new UseCompanyForm(industrySource).useForm()

const activeKey = ref(['0', '1'])
const toggleCollapse = (val: string) => {
  if (activeKey.value.includes(val)) {
    activeKey.value = activeKey.value.filter(item => item !== val)
  } else activeKey.value.push(val)
}
const onfilter = (value: string[]) => {
  modelRef.keyword = value.filter((item: string) => item.length <= 50)
    .filter((_item, index) => index < 5)
}
</script>

<template>
  <div class="base-company">
    <a-form layout="vertical" autocomplete="off">
      <a-collapse v-model:activeKey="activeKey" expandIconPosition="right" collapsible="disabled" ghost>
        <a-collapse-panel key="0" :showArrow="false" class="bg-white !rounded-lg mb-5 shadow-md p-3 pb-0">
          <template #header>
            <div>
              <div class="text-lg font-bold text-black">公司基本信息</div>
              <div class="text-gray-500 text-xs mt-2" v-show="activeKey.includes('0')">温馨提示：公司信息使用英文填写</div>
            </div>
          </template>
          <template #extra>
            <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse('0')">
              {{ activeKey.includes('0') ? '收起' : '展开' }}
            </span>
          </template>
          <a-row :gutter="[24]">
            <a-col :span="12">
              <a-form-item label="公司中文名称" name="company_name" v-bind="modelRule.company_name">
                <a-input v-model:value="modelRef.company_name" placeholder="请输入公司中文名称，不能超过50个字符" :maxlength="50"
                  :showCount="true" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="中文简称" name="company_short_name" v-bind="modelRule.company_short_name">
                <a-input v-model:value="modelRef.company_short_name" :maxlength="6" placeholder="请输入中文简称，不能超过6个字符"
                  :showCount="true" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="公司英文名称" name="company_enname" v-bind="modelRule.company_enname">
                <a-input v-model:value="modelRef.company_enname" placeholder="请输入公司英文名称，不能超过100个字符" :maxlength="100"
                  :showCount="true" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="公司英文简称" name="company_short_enname">
                <a-input v-model:value="modelRef.company_short_enname" placeholder="请输入公司英文简称，不能超过50个字符"
                  :maxlength="50" :showCount="true" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="主要业务模式" name="business_model" v-bind="modelRule.business_model">
                <a-radio-group v-model:value="modelRef.business_model">
                  <a-radio :value="item.key" v-for="item in businessList" :key="item.key">{{ item.value }}</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="品牌名称" name="brand" v-bind="modelRule.brand">
                <a-input v-model:value="modelRef.brand" placeholder="请输入品牌名称，如：Huawei等，不能超过50个字符" :maxlength="50"
                  :showCount="true" />
                <template #extra>
                  <div class="text-gray-500 text-xs mt-2">如果没注册品牌，则填写企业拼音简称+行业名，如：Xiang Metal Aofa Hair</div>
                </template>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="行业类型" name="industry_type" v-bind="modelRule.industry_type">
                <a-cascader size="large" :options="industryList" :fieldNames="{ label: 'industry_name', value: 'id' }"
                  v-model:value="modelRef.industry_type" placeholder="请选择行业" change-on-select />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="logo" label="网站logo" v-bind="modelRule.logo">
                <CommonUpload v-model:fileList="modelRef.logo" tip="支持jpg，jpeg，png，gif格式，文件小于1Mb" :max-size="1"
                  :selectType="MaterFileType.IMG"></CommonUpload>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="upload" label="网站ICON" v-bind="modelRule.icon">
                <CommonUpload v-model:fileList="modelRef.icon" :max-size="0.5" :selectType="MaterFileType.IMG">
                  <template #tip>
                    <div class="p-2 text-gray-400">
                      <!-- <div>系统可根据您的LOGO自动生成，也可自定义上传</div> -->
                      <div class="mt-1">
                        网站ICON是浏览器上的显示的小图标，
                        <a-popover title="网站ICON示例图" placement="bottom">
                          <template #content>
                            <div class="text-center">
                              <MediaImage src="/images/myImg/icon_show.png" />
                            </div>
                          </template>
                          <a href="javascript:;" class="text-green-500">查看示例</a>
                        </a-popover>
                      </div>
                    </div>
                  </template>
                </CommonUpload>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="主营产品关键词" name="keyword" v-bind="modelRule.keyword">
                <a-select size="large" v-model:value="modelRef.keyword" mode="tags" style="width: 100%"
                  :token-separators="[',']" placeholder="请输入公司主要产品或核心关键词" @change="onfilter" :open="false"></a-select>
                <template #extra>
                  <div class="text-gray-500 text-xs mt-2">请填写公司的主营产品关键词，按回车键隔开，最多可输入5个，每个关键词不超过50字符</div>
                </template>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="公司地址" name="address" v-bind="modelRule.address">
                <a-input v-model:value="modelRef.address" placeholder="请用英语输入您的详细地址, 不能超过50个字符" :maxlength="150"
                  :showCount="true" />
                <!-- <template #extra>
                  <div class=" text-gray-500 text-xs mt-2">所在省市区的地理位置区域，如：Guangdong/Guangzhou/YuXiu</div>
                </template>-->
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item name="summary">
                <template #label>
                  <div class="flex items-center">
                    <span>公司简介</span>
                    <a-tooltip placement="top">
                      <template #title>
                        <span>可以介绍公司成立于哪年哪地，公司占地面积，公司主要业务、销售业绩、研发能力（有专利等可以进行展示）、自主产品、生产能力（设备、人员）、质量管控能力、公司主要客户等，公司简介内容不要太简短，建议≥500个字符。</span>
                      </template>
                      <a href="javascript:;" class="flex items-center text-primary ml-1">
                        <question-circle-outlined />
                      </a>
                    </a-tooltip>
                  </div>
                </template>
                <a-textarea v-model:value="modelRef.summary" :maxlength="3000" show-count :row="4"
                  placeholder="请用英文输入公司的简介" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-collapse-panel>
        <a-collapse-panel key="1" :showArrow="false" class="bg-white !rounded-lg my-5 shadow-md p-3 pb-0">
          <template #header>
            <div>
              <div class="text-lg font-bold text-black">更多信息</div>
              <div class="text-gray-500 text-xs mt-2" v-show="activeKey.includes('1')">
                建议尽量填写完成，这些信息会应用于公司简介或公司优势等的智能生成作为资料来源</div>
            </div>
          </template>
          <template #extra>
            <span class="text-[#354662] text-sm cursor-pointer" @click="toggleCollapse('1')">
              {{ activeKey.includes('1') ? '收起' : '展开' }}
            </span>
          </template>
          <a-row :gutter="[24]">
            <a-col :span="12">
              <a-form-item label="成立时间" name="formation_date">
                <a-date-picker size="large" v-model:value="modelRef.formation_date" picker="year" class="!w-full" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="年产量" name="annual_yield">
                <a-input v-model:value="modelRef.annual_yield" placeholder="请输入公司年产量，例如：5 Million pcs，不能超过50个字符"
                  :maxlength="50" :showCount="true" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="企业类型" name="company_type">
                <a-select size="large" v-model:value="modelRef.company_type" placeholder="请选择企业类型">
                  <a-select-option :value="item.key" :key="item.key" v-for="item in companyTypeList">{{ item.value }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="出口市场" name="export_market">
                <a-select mode="multiple" :multiple="true" size="large" v-model:value="modelRef.export_market" placeholder="请选择出口市场">
                  <a-select-option :value="item.key" :key="item.key" v-for="item in marketList">{{ item.value }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="企业领导人" name="leadership">
                <a-input v-model:value="modelRef.leadership" placeholder="请输入企业法人/CEO/公司领导等名称，不能超过100个字符"
                  :maxlength="100" :showCount="true" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="员工数量" name="employees_num">
                <a-select size="large" v-model:value="modelRef.employees_num" placeholder="请选择员工数量">
                  <a-select-option :value="item.key" :key="item.key" v-for="item in employeesList">{{ item.value }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-collapse-panel>
      </a-collapse>
      <div class="mt-5 flex justify-center">
        <a-button type="primary" class="w-[100px]" @click="onSubmit">保存</a-button>
      </div>
    </a-form>
  </div>
</template>

<style lang='scss' scoped>
.base-company {
  :deep(.ant-input-affix-wrapper) {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
