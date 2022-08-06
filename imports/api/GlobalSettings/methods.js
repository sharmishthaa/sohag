import { Meteor } from 'meteor/meteor';
import { Items_per_page } from '../../config';
// import { fileUpload } from '../Utility/fileUpload';
// import { gsValueByField } from '../Utility/methods';
import { GlobalSettingsCollection } from './globalsettings';
 
Meteor.methods({
  'gs.insert'({...values}) {
    return GlobalSettingsCollection.insert({
        field_name:values.field_name, 
        display_name:values.display_name, 
        field_value:values.field_value, 
        input_type:values.input_type, 
        option_value:values.option_value, 
        status:values.status})
  },

  'gs.valuebyfield'(field_name) {
    return gsValueByField(field_name)
  },

  'gs.list'(pageNo, sortedInfo, searchText){
    const limit = Items_per_page
    const skip = (pageNo - 1) * limit
    let sortConditions = {}
    if(sortedInfo?.column !== undefined)
    {
      const sortValue = sortedInfo.order=='ascend'?1:-1
      sortConditions[sortedInfo.columnKey]=sortValue
      console.log(sortConditions)
    }

    else
    {
      sortConditions = { display_name: -1 } 
    }
    
    if(searchText)
    {
      const filterCond = []
      console.log(searchText);
      var reg = RegExp(searchText)
      filterCond.push({field_name:{ $regex: reg, $options: "i" }})
      filterCond.push({field_value:{ $regex: reg, $options: "i" }})
      filterCond.push({status:{ $regex: reg, $options: "i" }})
      return GlobalSettingsCollection.find({ $or: filterCond},{skip: skip, limit: limit, sort: sortConditions}).fetch();
    }
    return GlobalSettingsCollection.find({},{skip: skip, limit: limit, sort: sortConditions}).fetch();
  },

  'gs.count'(){
    return GlobalSettingsCollection.find({}).count();
  },

  'gs.profile'(gsID){
    return GlobalSettingsCollection.find({_id:gsID}).fetch();
  },

  'gs.editeddata'(gsID){
    return GlobalSettingsCollection.findOne({_id:gsID});
  },

  'gs.remove'(gsID) {
    GlobalSettingsCollection.remove(gsID);
  },

  'gs.edit'(gsID, {...values}){
    console.log(values)
    GlobalSettingsCollection.update(gsID, {$set: {
        field_name:values.field_name, 
        display_name:values.display_name, 
        field_value:values.field_value, 
        input_type:values.input_type, 
        option_value:values.option_value, 
        status:values.status}})
  },

  // 'gs.uploadToTempFolder': async (data) => {
  //   if (data) {
  //     let success = await fileUpload(data, "global-settings/temp");
  //     return success.filename;
  //   }
  // },

});