import moment from "moment";
import "moment/locale/es";

moment.updateLocale("es", {
  months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
  monthsShort: "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),
  weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
  weekdaysShort: "dom_lun_mar_mié_jue_vie_sáb".split("_"),
  weekdaysMin: "do_lu_ma_mi_ju_vi_sá".split("_"),
});

moment.locale("es");

export const formatDate = (date) => {
  return moment(date).format("ddd DD/MM/YY, HH:mm").replace("á", "a");
};

export default moment;