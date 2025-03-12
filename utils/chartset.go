package utils

import "golang.org/x/text/encoding/simplifiedchinese"

type Chartset string

const (
	UTF8    Chartset = "UTF-8"
	GBK     Chartset = "GBK"
	GB18030 Chartset = "GB18030"
)

func ConvertByte2String(data []byte, chartset Chartset) string {
	var str string
	switch chartset {
	case GB18030:
		var decodeBytes, _ = simplifiedchinese.GB18030.NewDecoder().Bytes(data)
		str = string(decodeBytes)
	case GBK:
		var decodeBytes, _ = simplifiedchinese.GBK.NewDecoder().Bytes(data)
		str = string(decodeBytes)
	case UTF8:
		fallthrough
	default:
		str = string(data)
	}
	return str
}
