curl "https://api.spotify.com/v1/browse/categories/${CATEGORY}/playlists?limit=3" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
