#! bin/bash
sudo systemctl daemon-reload
sudo systemctl start express
sudo systemctl enable express