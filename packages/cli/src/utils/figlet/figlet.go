package figlet

import (
	"fmt"

	"github.com/mbndr/figlet4go"
)

// LogProgramName ...
func LogProgramName() {
	ascii := figlet4go.NewAsciiRender()
	programString, _ := ascii.Render("IG CLI")
	fmt.Println(programString)
}
