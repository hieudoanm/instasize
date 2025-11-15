// Package cmd ...
package cmd

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"ig-cli/utils/figlet"
	"ig-cli/utils/http"
	"os"
	"regexp"

	"github.com/spf13/cobra"
)

// DownloadResponse ...
type DownloadResponse struct {
	Images []string `json:"images"`
}

// instagramDownloadCmd represents the instagramDownload command
var instagramDownloadCmd = &cobra.Command{
	Use:   "download",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		figlet.LogProgramName()
		// Get URL
		fmt.Print("URL (https://www.instagram.com/p/DEKkNw2uzV1): ")
		var url string
		fmt.Scanln(&url)
		// Download Images
		fmt.Println("Downloading")
		var downloadURL string = "https://nothing-instagram.onrender.com/api/download"
		requestBody := map[string]string{"url": url}
		var options = http.Options{}
		options.Body = requestBody
		responseByte, postError := http.Post(downloadURL, options)
		if postError != nil {
			fmt.Println("Error: ", postError)
			return
		}
		// Parse response
		var downloadResponse DownloadResponse
		jsonError := json.Unmarshal(responseByte, &downloadResponse)
		if jsonError != nil {
			fmt.Println("Error: ", jsonError)
			return
		}
		for index, image := range downloadResponse.Images {
			ConvertDataURLToImage(image, fmt.Sprintf("%d.jpg", index))
		}
		fmt.Println("Success")
	},
}

// ConvertDataURLToImage extracts the Base64 data and decodes it into an image file
func ConvertDataURLToImage(dataURL, outputPath string) error {
	// Regular expression to extract the Base64 part
	re := regexp.MustCompile(`^data:image/(\w+);base64,(.+)`)
	matches := re.FindStringSubmatch(dataURL)
	if len(matches) != 3 {
		return fmt.Errorf("invalid data URL format")
	}

	// Extract and decode Base64 data
	imageData, err := base64.StdEncoding.DecodeString(matches[2])
	if err != nil {
		return err
	}

	// Write the decoded data to an output file
	err = os.WriteFile(outputPath, imageData, 0644)
	if err != nil {
		return err
	}

	fmt.Println("Image saved as:", outputPath)
	return nil
}

func init() {
	rootCmd.AddCommand(instagramDownloadCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// instagramDownloadCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// instagramDownloadCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
