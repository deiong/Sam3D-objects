// install.js
module.exports = {
    requires: {
        bundle: "ai",
    },
    run: [
        {
            method: "shell.run",
            params: {
                message: [
                    "git clone https://github.com/facebookresearch/sam-3d-objects app",
                ]
            }
        },
        {
            method: "shell.run",
            params: {
                message: "conda env create -f app/environments/default.yml --name env"  // Use conda; replace with mamba if preferred
            }
        },
        {
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                env: { "PIP_EXTRA_INDEX_URL": "https://pypi.ngc.nvidia.com https://download.pytorch.org/whl/cu121" },
                message: [
                    "python -m pip install --upgrade pip",
                    "pip install -e .[dev]",
                    "pip install -e .[p3d]"
                ]
            }
        },
        {
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                env: { "PIP_FIND_LINKS": "https://nvidia-kaolin.s3.us-east-2.amazonaws.com/torch-2.5.1_cu121.html" },
                message: "pip install -e .[inference]"
            }
        },
        {
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                message: "./patching/hydra"
            }
        },
        {
            method: "script.start",
            params: {
                uri: "torch.js",
                params: {
                    venv: "env",
                    path: "app",
                }
            }
        },
        {
            method: "input.form",
            params: {
                title: "Hugging Face Access Token",
                items: [{
                    key: "token",
                    type: "text",
                    placeholder: "Enter your HF token (hf_XXX...)",
                    description: "Required for checkpoints; request access on Hugging Face first."
                }]
            }
        },
        {
            method: "shell.run",
            params: {
                venv: "env",
                message: "huggingface-cli login --token {{input.token}}"
            }
        },
        {
            method: "shell.run",
            params: {
                venv: "env",
                path: "app",
                message: [
                    "pip install 'huggingface-hub[cli]<1.0'",
                    "huggingface-cli download --repo-type model --local-dir checkpoints/hf-download --max-workers 1 facebook/sam-3d-objects",
                    "mv checkpoints/hf-download/checkpoints checkpoints/hf",
                    "rm -rf checkpoints/hf-download"
                ]
            }
        },
        {
            method: "shell.run",
            params: {
                message: [
                    "git clone https://github.com/facebookresearch/segment-anything-2 sam2",
                ]
            }
        },
        {
            method: "shell.run",
            params: {
                path: "app/checkpoints/sam2",
                message: "huggingface-cli download facebook/sam2-hiera-large --local-dir=checkpoints"
            }
        }
    ]
}